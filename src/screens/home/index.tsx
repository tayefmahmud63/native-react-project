import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, IconButton } from 'react-native-paper';
import { MainScreen } from './Main';
import { SettingScreen } from './Settings';
import { SongsList } from '../shared/SongsList';
import { SongList } from './SongList';

const Stack = createStackNavigator();

const HomeStack = () => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        safeAreaInsets: { top: 0, bottom: 0 },
        headerBackImage: () => (
          <IconButton style={{ marginLeft: 0 }} icon="arrow-back" />
        ),
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="Home"
        component={MainScreen}
        options={({ navigation }) => ({
          headerTitle: "DISCOVER",
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: 'Nunito-ExtraBold', fontSize: 16 },
          // headerRight: () => (
          //   <IconButton
          //     icon="settings-outline"
          //     onPress={() => navigation.navigate('Settings')}
          //   />
          // ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={{
          headerTitleAlign: 'center',
          headerTitle: 'Settings',
        }}
      />

      <Stack.Screen name="Playlist" component={SongsList} />
    </Stack.Navigator>
  );
};

export default HomeStack;
