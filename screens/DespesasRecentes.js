import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DespesasRecentes() {
  return (
    <View style={styles.container}>
      <Text>Despesas Recentes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});