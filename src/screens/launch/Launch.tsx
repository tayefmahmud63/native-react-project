import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Auth } from 'aws-amplify';

export interface LaunchScreenProps extends StackScreenProps { }

function LaunchScreen({ navigation }: LaunchScreenProps) {
  const { colors } = useTheme();
  const { introSlidesShown, user } = useSelector(state => state.user);

  async function bootstrap() {
    Auth.currentAuthenticatedUser()
      .then(currentUser => {
        navigation.navigate('App');
      })
      .catch(() => {
        console.log("Not signed in");
        navigation.navigate('Auth');
      });
  }

  useEffect(() => {
    bootstrap();
  }, []);

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}

export default LaunchScreen;
