/**
 * @format
 */

import {registerGlobals} from 'react-native-webrtc';
import {AppRegistry} from 'react-native';
import App from './App';
// VaniraCallBox example: import App from './examples/vanira-call-box/App';
import {name as appName} from './app.json';

// Required before any WebRTC / getUserMedia usage in @vanira/react-native-sdk.
registerGlobals();

AppRegistry.registerComponent(appName, () => App);
