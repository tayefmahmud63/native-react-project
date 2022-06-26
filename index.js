/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {AppRegistry, Linking} from 'react-native';
import {enableScreens} from 'react-native-screens';
import TrackPlayer from 'react-native-track-player';
import awsconfig from './src/aws-exports'
import { Amplify } from 'aws-amplify'
import InAppBrowser from 'react-native-inappbrowser-reborn';

import App from './src/App';
import {name as appName} from './app.json';

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const { type, url: newUrl } = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
      console.log("url", newUrl);
    Linking.openURL(newUrl);
  }
}

Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    urlOpener,
  },
});

enableScreens();
TrackPlayer.registerPlaybackService(() => require('./service'));
AppRegistry.registerComponent(appName, () => App);
