import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import DespesaItem from './DespesaItem';

function renderizarItem(itemData) {
  return <DespesaItem {...itemData.item} />;
}

export default function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      renderItem={renderizarItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingBottom: 24,
  },
});