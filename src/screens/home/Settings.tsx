import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
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
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { Screen } from '../../components/Screen';
import { updateTheme, changeRadioMode } from '../../actions';
import { clearHistory } from '../../actions/playerState';
import { AlertDialog } from '../../components/AlertDialog';
import { removeUserInfo } from '../../actions/userState';
import { log } from '../../utils/logging';
import { LoadingDialog } from '../../components/LoadingDialog';
import { DiagnoseDialog } from './components/DiagnoseDialog';
import Auth from '@aws-amplify/auth';

export const SettingScreen = ({ navigation }: StackScreenProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { googleAccessGiven, user } = useSelector(state => state.user);

  const [visible, setVisible] = useState('');
  const radio = useSelector((state: any) => state.config.radio);
  const theme = useTheme();
  const { dark } = theme;

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
      Auth.signOut();
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


  const clearData = () => {
    dispatch(clearHistory());
    setVisible('');
  };

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
        <List.Item
          title={user.username}
          description={user.attributes.email}
          left={props =>
            user.attributes.photo ? (
              <Avatar.Image {...props} source={{ uri: user.attributes.photo }} />
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
              // onPress={signIn}
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
