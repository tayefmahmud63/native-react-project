/* global __DEV__ */
import { Platform } from 'react-native';


export function sendMessage(content: any) {
  fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  }).catch(error => {
    console.log('error', error);
  });
}

export const log = {
  error(title: any, message?: any) {
    try {
      if (__DEV__) {
        console.error(title, message);
      }
    } catch (error) {
      console.log(error);
    }
  },

  debug(title: string, message: string) {
    try {
      if (__DEV__) {
        console.log("debug: ", title, message);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
