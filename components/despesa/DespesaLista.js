import React from 'react';
import { FlatList, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaItem from './DespesaItem';

export default function DespesaLista({ despesas }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 600;

  // Calcula a largura exata do painel "Total Exibido" 
  // (Limita a 900px e subtrai os 24px de margem de cada lado = 48px)
  const larguraContainer = Math.min(width, 900) - 64;

  let colunas = 1;
  let itemWidth = larguraContainer; 

  if (isDesktop) {
    if (despesas.length === 1) {
      colunas = 1;
      itemWidth = larguraContainer; 
    } else if (despesas.length === 2) {
      colunas = 2;
      // Math.floor garante que números quebrados não empurrem o último item
      itemWidth = Math.floor((larguraContainer - 16) / 2); 
    } else {
      colunas = 3;
      // Desconta os 2 espaços (32px) e divide por 3 perfeitamente
      itemWidth = Math.floor((larguraContainer - 32) / 3); 
    }
  }

  function renderizarItem({ item }) {
    return <DespesaItem {...item} largura={itemWidth} />;
  }

  if (despesas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color="#6B7280" />
        <Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>
        <Text style={styles.emptySubtext}>Toque em + para adicionar.</Text>
      </View>
    );
  }

  return (
    <FlatList
      key={colunas} 
      data={despesas}
      renderItem={renderizarItem}
      keyExtractor={(item) => item.id}
      numColumns={colunas}
      contentContainerStyle={styles.lista}
      columnWrapperStyle={colunas > 1 ? styles.row : null}
    />
  );
}

const styles = StyleSheet.create({
  lista: { 
    paddingBottom: 24,
    gap: 16, 
  },
  row: { 
    gap: 16, 
    justifyContent: 'flex-start', // Garante que preenchem da esquerda para a direita perfeitamente
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubtext: { color: '#9CA3AF', fontSize: 14, marginTop: 8 }
});