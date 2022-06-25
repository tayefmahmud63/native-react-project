import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import moment from 'moment';
import { getUser } from '../../actions/userState';

export interface LaunchScreenProps extends StackScreenProps { }

function LaunchScreen({ navigation }: LaunchScreenProps) {
  const { colors } = useTheme();
  const { introSlidesShown, user } = useSelector(state => state.user);

  async function bootstrap() {
    if (introSlidesShown) {
      const info = await getUser(user);
      if (info.isFreeTrialCompleted || !info.isFreeTrialStarted) {
        navigation.navigate('Payment');
      } else {
        const validTrial = moment(info.startDate).isAfter(
          moment(info.startDate).add(30, 'days'),
        );
        if (validTrial) {
          navigation.navigate('Payment');
        } else {
          navigation.navigate('App');
        }
      }
    } else {
      navigation.navigate('Intro');
    }
  }

  useEffect(() => {
    console.log("bootstrap", user, introSlidesShown);
    // bootstrap();
    navigation.navigate('App');
    // createUser({ user: { email: 'yajananrao@gmail.com' } }).then(info => {
    //   console.log('info', info);
    // })
  }, []);

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}

export default LaunchScreen;
