import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export function ContentScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>My voice app</Text>
      <Text style={styles.body}>Tap the voice pill to talk to your agent.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
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
});
