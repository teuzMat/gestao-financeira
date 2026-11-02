import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

export default function GlobalWrapper({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19', 
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 900,
    paddingHorizontal: 24,
    paddingVertical: 16,
  }
});