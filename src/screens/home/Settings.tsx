import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {
  Text,
  Switch,
  Drawer,
  TouchableRipple,
  useTheme,
  List,
  Avatar,
  Banner,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackScreenProps} from '@react-navigation/stack';
import {Screen} from '../../components/Screen';
import {updateTheme, changeRadioMode} from '../../actions';
import {clearHistory} from '../../actions/playerState';
import {AlertDialog} from '../../components/AlertDialog';
import {getUser, googleSignIn, removeUserInfo} from '../../actions/userState';
import {log} from '../../utils/logging';
import {LoadingDialog} from '../../components/LoadingDialog';
import {DiagnoseDialog} from './components/DiagnoseDialog';
import moment from 'moment';
import {useEffect} from 'react';

export const SettingScreen = ({navigation}: StackScreenProps) => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  const {googleAccessGiven, user} = useSelector(state => state.user);

  const [visible, setVisible] = useState('');
  const radio = useSelector((state: any) => state.config.radio);
  const theme = useTheme();
  const {dark} = theme;

  const toggleTheme = (isDark: boolean) => {
    let themeType = 'default';
    if (isDark) {
      themeType = 'dark';
    }
    dispatch(updateTheme(themeType));
  };

  const toggleRadioMode = () => {
    dispatch(changeRadioMode(!radio));
  };

  const showAlert = () => {
    setVisible('ALERT');
  };

  const signOut = async () => {
    try {
      setLoading(true);
      GoogleSignin.configure();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
      const {idToken} = await GoogleSignin.getTokens();
      await GoogleSignin.clearCachedAccessToken(idToken);
      await AsyncStorage.clear();
      dispatch(removeUserInfo());
      setLoading(false);
      navigation.navigate('Intro');
    } catch (error) {
      log.error('signOut', error);
      setLoading(false);
      navigation.navigate('Intro');
    }
  };

  const signIn = async () => {
    try {
      dispatch(googleSignIn());
    } catch (error) {
      log.error('signIn', error);
    }
  };

  const clearData = () => {
    dispatch(clearHistory());
    setVisible('');
  };

  useEffect(() => {
    getUser(user).then(info => {
      setUserInfo(info);
      console.log(info);
    });
  }, []);

  return (
    <Screen>
      <AlertDialog
        visible={visible === 'ALERT'}
        title="Clear History"
        message="Do you want to clear all your songs history ?"
        action={clearData}
        hideDialog={() => setVisible('')}
      />
      <DiagnoseDialog
        visible={visible === 'DIAGNOSE'}
        hideDialog={() => setVisible('')}
      />
      <LoadingDialog visible={loading} title="Logging you out" />
      <ScrollView>
        <Banner
          visible={userInfo?.freeTrial}
          actions={[
            {
              label: 'Learn more',
              onPress: () => navigation.navigate('Payment'),
            },
          ]}
          // icon={({ size }) => (
          //   <Image
          //     source={{
          //       uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
          //     }}
          //     style={{
          //       width: size,
          //       height: size,
          //     }}
          //   />
          // )}
        >
          {`Your free trial will expire ${moment(userInfo?.startDate)
            .add(30, 'days')
            .fromNow()}`}
        </Banner>
        <List.Item
          title={user.user.name}
          description={user.user.email}
          left={props =>
            user.user.photo ? (
              <Avatar.Image {...props} source={{uri: user.user.photo}} />
            ) : (
              <List.Icon {...props} icon="person-outline" />
            )
          }
        />
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => toggleTheme(dark)}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={dark} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={toggleRadioMode}>
            <View style={styles.preference}>
              <Text>Radio Mode</Text>
              <View pointerEvents="none">
                <Switch value={radio} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        <Drawer.Section title="Data">
          <Drawer.Item
            onPress={() => setVisible('DIAGNOSE')}
            label="Diagnostics"
            icon="alert-circle-outline"
          />
          <Drawer.Item
            onPress={() => navigation.navigate('Payment')}
            label="Subscription Plan"
            icon="person-outline"
          />
          <Drawer.Item
            onPress={showAlert}
            label="Clear history"
            icon="trash-outline"
          />
          {!googleAccessGiven || !user ? (
            <Drawer.Item
              onPress={signIn}
              label="Sign In"
              icon="log-in-outline"
            />
          ) : (
            <Drawer.Item
              onPress={signOut}
              label="Sign Out"
              icon="log-out-outline"
            />
          )}
        </Drawer.Section>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
