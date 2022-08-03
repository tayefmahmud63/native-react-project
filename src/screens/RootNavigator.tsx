import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import RNBootSplash from 'react-native-bootsplash';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import color from 'color';

import { SafeAreaView } from 'react-native';
import ArtistPortal from './offline';
import { SearchStack } from './search';
import HomeStack from './home';
import { LibraryStack } from './library';
import { BottomTabBar } from '../components/BottomTabBar';
import NotificationContainer from '../containers/NotificationContainer';
import LaunchScreen from './launch/Launch';
import { PlayerStack } from './player';
import { FindScreen } from './shared/Find';
// import { Header } from '../components/Header';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Login from './Auth/Login';
import Verify from './Auth/Verify';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const NativeStack = createNativeStackNavigator();

const BottomNavigator = () => {
  const theme = useTheme();
  const { colors } = theme;
  const activeTintColor = colors.primary;
  const inactiveTintColor = color(colors.text).alpha(0.5).rgb().string();

  return (
    <Tab.Navigator
      tabBar={props => (
        <BottomTabBar {...props} backgroundColor={colors.surface} />
      )}
      tabBarOptions={{
        style: { backgroundColor: colors.surface },
        activeTintColor,
        inactiveTintColor,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconButton
              icon={'discover'}
              color={focused ? activeTintColor : inactiveTintColor}
              style={{ margin: 0, padding: 0 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconButton
              icon={focused ? 'search' : 'search-outline'}
              color={focused ? activeTintColor : inactiveTintColor}
              style={{ margin: 0, padding: 0 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryStack}
        options={{
          tabBarLabel: 'Your library',
          tabBarIcon: ({ focused }) => (
            <IconButton
              icon={'library'}
              color={focused ? activeTintColor : inactiveTintColor}
              style={{ margin: 0, padding: 0 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Artist Portal"
        component={ArtistPortal}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconButton
              icon={'artist'}
              color={focused ? activeTintColor : inactiveTintColor}
              style={{ margin: 0, padding: 0 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Main"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Find"
        component={FindScreen}
        initialParams={{ type: 'all' }}
        options={{
          headerTitle: 'Search',
          headerTitleAlign: 'center',
          headerLeft: () => null,
          headerTitleStyle: { fontFamily: 'Nunito-ExtraBold', fontSize: 28 },
        }}
      />
      <Stack.Screen
        name="Player"
        component={PlayerStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


function Auth() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <AuthStack.Screen name="SignIn" component={SignIn} options={{ title: 'LOGIN', headerBackTitleVisible: false }} />
      <AuthStack.Screen name="SignUp" component={SignUp} options={{ headerBackTitleVisible: false, title: 'CREATE ACCOUNT', headerTitleAlign: 'center' }} />
      <AuthStack.Screen name="Verify" component={Verify} />
    </AuthStack.Navigator>
  )
}

const AppStack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Launch">
      <NativeStack.Screen name="App" component={RootStack} />
      <NativeStack.Screen name="Auth" component={Auth} />
      <NativeStack.Screen name="Launch" component={LaunchScreen} />
    </NativeStack.Navigator>
  );
};
export const RootNavigator = () => {
  const theme = useTheme();
  const { colors } = theme;
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <NotificationContainer />
      <AppStack />
    </SafeAreaView>
  );
};
