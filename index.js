/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';
import TrackPlayer from 'react-native-track-player';
import awsconfig from './src/aws-exports'
import { Amplify } from 'aws-amplify'

import App from './src/App';
import {name as appName} from './app.json';

Amplify.configure(awsconfig)
enableScreens();
TrackPlayer.registerPlaybackService(() => require('./service'));
AppRegistry.registerComponent(appName, () => App);
