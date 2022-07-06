import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from '../utils/logging';

export const setUserInfo =
  (user: any) => (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
    try {
      dispatch({
        payload: user,
        type: 'SET_USER',
      });
    } catch (error) {
      log.error('setUserInfo', error);
    }
  };

export const removeUserInfo =
  () => (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
    try {
      dispatch({
        type: 'REMOVE_USER',
      });
    } catch (error) {
      log.error('removeUserInfo', error);
    }
  };

export function startFreeTrial(key: string) {
  console.log(key);
  // firestore()
  //   .collection('Users')
  //   .doc(key)
  //   .update({
  //     isFreeTrialStarted: true,
  //   })
  //   .then(() => {
  //     console.log('User updated!');
  //   });
}
export function getUserSubscription(email) {
  // return firestore().collection('Users').where('email', 'in', [email]).get();
  return {}
}
export async function getUser(userInfo) {
  return new Promise(async (resolve, reject) => {
    console.log(userInfo);
    const response = await getUserSubscription(userInfo.attributes.email);

    response.forEach(item => {
      const user = item.data();
      user.id = item.id;
      user.startDate = user.startDate.toDate();
      console.log('user', user);
      resolve(user);
    });
  });
}


export const skipGoogleLogin =
  (skip: boolean) =>
    (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
      try {
        dispatch({ type: 'SET_GOOGLE_ACCESS', payload: skip });
      } catch (error) {
        log.error('skipGoogleLogin', error);
      }
    };

export const giveReadOfflineAccess =
  () => (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
    try {
      if (Platform.OS === 'ios') {
        dispatch({ type: 'SET_OFFLINE_READ_ACCESS', payload: true });
      } else {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => {
          log.debug('giveReadOfflineAccess', status);
          if (status) {
            dispatch({ type: 'SET_OFFLINE_READ_ACCESS', payload: true });
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Grant Access',
                message:
                  'Serenity App needs access to your EXTERNAL_STORAGE ' +
                  'so you can play offline songs.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            ).then(granted => {
              log.debug('giveReadOfflineAccess', granted);
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                dispatch({ type: 'SET_OFFLINE_READ_ACCESS', payload: true });
              } else {
                dispatch({ type: 'SET_OFFLINE_READ_ACCESS', payload: false });
              }
            });
          }
        });
      }
    } catch (err) {
      log.error('giveReadOfflineAccess', err);
    }
  };

export const giveWriteOfflineAccess =
  () => (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
    try {
      if (Platform.OS === 'ios') {
        dispatch({ type: 'SET_OFFLINE_WRITE_ACCESS', payload: false });
      } else {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ).then(status => {
          log.debug('giveWriteOfflineAccess', status);
          if (status) {
            dispatch({ type: 'SET_OFFLINE_WRITE_ACCESS', payload: true });
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Grant Access',
                message:
                  'Serenity App needs access to your EXTERNAL_STORAGE ' +
                  'so you can play offline songs.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            ).then(granted => {
              log.debug('giveWriteOfflineAccess', granted);
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                dispatch({ type: 'SET_OFFLINE_WRITE_ACCESS', payload: true });
              } else {
                dispatch({ type: 'SET_OFFLINE_WRITE_ACCESS', payload: false });
              }
            });
          }
        });
      }
    } catch (err) {
      log.error('giveWriteOfflineAccess', err);
    }
  };

export const appIntroduction =
  (state: boolean) =>
    (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
      try {
        dispatch({ type: 'APP_INTRO', payload: state });
      } catch (error) {
        log.error('appIntroduction', error);
      }
    };
