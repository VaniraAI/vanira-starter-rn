import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  PresetHostProvider,
  VaniraCallProvider,
} from '@vanira/react-native-sdk/headless';
import {
  VANIRA_AGENT_ID,
  VANIRA_API_KEY,
  VANIRA_BACKEND_URL,
  isVaniraConfigured,
} from './src/config/vanira';
import {vaniraRuntime} from './src/config/runtime';
import {HomeScreen} from './src/screens/HomeScreen';

function ConfiguredApp() {
  return (
    <PresetHostProvider>
      <VaniraCallProvider
        agentId={VANIRA_AGENT_ID}
        apiKey={VANIRA_API_KEY}
        backendUrl={VANIRA_BACKEND_URL}
        runtime={vaniraRuntime}
        currentRoute="Home">
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
          <HomeScreen configured />
        </SafeAreaView>
      </VaniraCallProvider>
    </PresetHostProvider>
  );
}

function App() {
  const configured = isVaniraConfigured();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
      {configured ? (
        <ConfiguredApp />
      ) : (
        <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
          <HomeScreen configured={false} />
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

export default App;
