import {reactNativeRuntime} from '@vanira/react-native-sdk';
import {persistentCallStorage} from '../storage/callSessionStorage';

if (!reactNativeRuntime) {
  throw new Error(
    '[runtime] reactNativeRuntime failed to load from @vanira/react-native-sdk',
  );
}

/** SDK runtime with disk-backed session storage (continue / resume). */
export const vaniraRuntime = {
  ...reactNativeRuntime,
  name: 'vanira-starter-rn',
  storage: persistentCallStorage,
};
