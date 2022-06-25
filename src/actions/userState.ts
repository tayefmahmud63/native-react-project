import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
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
    const response = await getUserSubscription(userInfo.user.email);

    if (!response.size) {
      const user = {
        name: userInfo.user.name,
        email: userInfo.user.email,
        isFreeTrialStarted: false,
        isFreeTrialCompleted: false,
        startDate: new Date(),
      };
      // firestore()
      //   .collection('Users')
      //   .add(user)
      //   .then(() => {
      //     console.log('User added!');
      //     resolve(user);
      //   })
      //   .catch(error => reject(error));
    }
    response.forEach(item => {
      const user = item.data();
      user.id = item.id;
      user.startDate = user.startDate.toDate();
      console.log('user', user);
      resolve(user);
    });
  });
}

export const googleSignIn =
  () => async (dispatch: ThunkDispatch<undefined, undefined, AnyAction>) => {
    try {
      GoogleSignin.configure({
        scopes: ['email'],
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      dispatch({
        payload: userInfo,
        type: 'SET_USER',
      });
      dispatch(appIntroduction(true));

      const token = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('@token', token.accessToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      log.error('skipGoogleSignIn', error);
    }
  };

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
