const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const sdkRoot = path.resolve(
  projectRoot,
  '../vanira-dashboard/react-native-mobile/vanira-sdk-rn',
);
const appModules = path.resolve(projectRoot, 'node_modules');

/** Peer deps — must resolve from the app, not the SDK's dev node_modules. */
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

/** Bundle @vanira/sdk-react-native from local source (pre-npm publish). */
const config = {
  watchFolders: [sdkRoot],
  resolver: {
    unstable_enablePackageExports: true,
    // Only the app's node_modules — SDK node_modules has its own React (vitest).
    nodeModulesPaths: [appModules],
    extraNodeModules: sharedModules,
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@vanira/sdk-react-native') {
        return {
          filePath: path.join(sdkRoot, 'src/index.ts'),
          type: 'sourceFile',
        };
      }
      if (moduleName === '@vanira/sdk-react-native/headless') {
        return {
          filePath: path.join(sdkRoot, 'src/headless/index.ts'),
          type: 'sourceFile',
        };
      }
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
