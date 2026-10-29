import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DespesaSumario({ despesas, periodoNome }) {
  const total = despesas.reduce((acumulador, item) => acumulador + item.valor, 0);
  const corDoValor = total > 200 ? '#EF4444' : '#7C3AED'; // Desafio Extra com Vermelho Erro

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodoNome}</Text>
      <Text style={[styles.soma, { color: corDoValor }]}>
        R$ {total.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#151A27',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#252B3A',
  },
  periodo: { fontSize: 14, color: '#D1D5DB', fontWeight: '600' },
  soma: { fontSize: 20, fontWeight: '800' },
});