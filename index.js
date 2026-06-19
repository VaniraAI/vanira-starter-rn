/**
 * @format
 */

import {registerGlobals} from 'react-native-webrtc';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Required before any WebRTC / getUserMedia usage in @vanira/sdk-react-native.
registerGlobals();

AppRegistry.registerComponent(appName, () => App);
