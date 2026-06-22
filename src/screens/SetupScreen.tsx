import React from 'react';
import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';

type Props = {
  docsUrl: string;
};

export function SetupScreen({docsUrl}: Props) {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Vanira RN Starter</Text>
      <Text style={styles.body}>
        Copy <Text style={styles.code}>.env.example</Text> to <Text style={styles.code}>.env</Text>{' '}
        with your agent ID and <Text style={styles.code}>pk_live_*</Text> publishable key, then
        restart Metro.
      </Text>
      <Pressable style={styles.linkBtn} onPress={() => Linking.openURL(docsUrl)}>
        <Text style={styles.linkBtnText}>SDK docs →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
