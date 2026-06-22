import {StatusBar, StyleSheet} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {VaniraCallBox} from '@vanira/react-native-sdk';
import {
  VANIRA_AGENT_ID,
  VANIRA_API_KEY,
  VANIRA_BACKEND_URL,
  isVaniraConfigured,
} from '../../src/config/vanira';
import {vaniraRuntime} from '../../src/config/runtime';
import {SetupScreen} from '../../src/screens/SetupScreen';
import {ContentScreen} from './ContentScreen';

function ConfiguredApp() {
  const insets = useSafeAreaInsets();

  return (
    <VaniraCallBox
      agentId={VANIRA_AGENT_ID}
      apiKey={VANIRA_API_KEY}
      backendUrl={VANIRA_BACKEND_URL}
      runtime={vaniraRuntime}
      currentRoute="Home"
      title="Voice chat"
      containerStyle={{bottom: Math.max(16, insets.bottom + 8)}}>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <ContentScreen />
      </SafeAreaView>
    </VaniraCallBox>
  );
}

/**
 * VaniraCallBox example — drop-in voice pill + preset modals.
 * To run: point index.js at this file (see examples/vanira-call-box/README snippet in repo README).
 */
export default function VaniraCallBoxExampleApp() {
  const configured = isVaniraConfigured();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
      {configured ? (
        <ConfiguredApp />
      ) : (
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
          <SetupScreen docsUrl="https://vanira.io/docs#rn-sdk-install" />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
});
