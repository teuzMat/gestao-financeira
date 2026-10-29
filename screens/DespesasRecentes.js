import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlobalWrapper from '../components/GlobalWrapper';
import DespesaSaida from '../components/despesa/DespesaSaida';

// Dados fictícios simulando despesas recentes
const DESPESAS_MOCK_RECENTES = [
  { id: 'd1', descricao: 'Almoço Restaurante', valor: 45.50, data: '2026-10-25', categoria: 'Alimentação' },
  { id: 'd2', descricao: 'Uber para Casa', valor: 35.00, data: '2026-10-26', categoria: 'Transporte' },
];

export default function DespesasRecentes() {
  return (
    <GlobalWrapper>
      <View style={styles.container}>
        <DespesaSaida 
          despesas={DESPESAS_MOCK_RECENTES} 
          periodoNome="Últimos 7 Dias" 
        />
      </View>
    </GlobalWrapper>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%' 
  },
});