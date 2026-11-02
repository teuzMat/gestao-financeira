import React from 'react';
import { View, StyleSheet } from 'react-native';
import DespesaSumario from './DespesaSumario';
import DespesaLista from './DespesaLista';

export default function DespesaSaida({ despesas, periodoNome }) {
  return (
    <View style={styles.container}>
      <DespesaSumario despesas={despesas} periodoNome={periodoNome} />
      <DespesaLista despesas={despesas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
});