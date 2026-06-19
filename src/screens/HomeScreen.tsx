import React from 'react';
import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import {HeadlessVoiceCall} from '../components/HeadlessVoiceCall';

const DOCS_URL = 'https://vanira.io/docs#rn-sdk-headless';

type Props = {
  configured: boolean;
};

export function HomeScreen({configured}: Props) {
  if (!configured) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Vanira RN Starter</Text>
        <Text style={styles.body}>
          Copy <Text style={styles.code}>.env.example</Text> to <Text style={styles.code}>.env</Text>{' '}
          with your agent ID and <Text style={styles.code}>pk_live_*</Text> publishable key, then
          restart Metro.
        </Text>
        <Pressable style={styles.linkBtn} onPress={() => Linking.openURL(DOCS_URL)}>
          <Text style={styles.linkBtnText}>Headless SDK docs →</Text>
        </Pressable>
      </View>
    );
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
  centered: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748b',
  },
  code: {
    fontFamily: 'Menlo',
    fontSize: 13,
    color: '#0f172a',
  },
  linkBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  linkBtnText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
});
