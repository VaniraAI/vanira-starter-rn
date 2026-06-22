import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HeadlessVoiceCall} from '../components/HeadlessVoiceCall';
import {SetupScreen} from './SetupScreen';

const DOCS_URL = 'https://vanira.io/docs#rn-sdk-headless';

type Props = {
  configured: boolean;
};

export function HomeScreen({configured}: Props) {
  if (!configured) {
    return <SetupScreen docsUrl={DOCS_URL} />;
  }

  return (
    <View style={styles.screen}>
      <HeadlessVoiceCall />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
});
