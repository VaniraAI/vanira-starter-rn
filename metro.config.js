const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const appModules = path.resolve(projectRoot, 'node_modules');

/** Peer deps — resolve native modules from the app, not nested copies. */
const sharedModules = {
  react: path.join(appModules, 'react'),
  'react-native': path.join(appModules, 'react-native'),
  'react-native-svg': path.join(appModules, 'react-native-svg'),
  'react-native-webrtc': path.join(appModules, 'react-native-webrtc'),
  'react-native-permissions': path.join(appModules, 'react-native-permissions'),
  'react-native-incall-manager': path.join(appModules, 'react-native-incall-manager'),
  'react-native-image-picker': path.join(appModules, 'react-native-image-picker'),
  '@react-native-documents/picker': path.join(
    appModules,
    '@react-native-documents/picker',
  ),
  'react-native-view-shot': path.join(appModules, 'react-native-view-shot'),
  'react-native-vision-camera': path.join(appModules, 'react-native-vision-camera'),
  '@react-native-async-storage/async-storage': path.join(
    appModules,
    '@react-native-async-storage/async-storage',
  ),
};

const config = {
  resolver: {
    unstable_enablePackageExports: true,
    extraNodeModules: sharedModules,
    resolveRequest: (context, moduleName, platform) => {
      if (sharedModules[moduleName]) {
        return {
          filePath: require.resolve(moduleName, {paths: [projectRoot]}),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
