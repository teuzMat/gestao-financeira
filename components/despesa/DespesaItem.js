import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getDataFormatada = (data) => new Date(data).toLocaleDateString('pt-BR');

export default function DespesaItem({ descricao, valor, data, categoria }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.descricao}>{descricao}</Text>
        <Text style={styles.data}>{getDataFormatada(data)}</Text>
      </View>
      
      <View style={styles.valoresContainer}>
        <View style={styles.categoriaTag}>
          <Text style={styles.categoriaTexto}>{categoria}</Text>
        </View>
        <View style={styles.valorContainer}>
          <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#151A27',
    padding: 16,
    marginVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#202638',
  },
  infoContainer: { flex: 1, justifyContent: 'center' },
  descricao: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  data: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  valoresContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  categoriaTag: {
    backgroundColor: '#1B2130',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoriaTexto: { fontSize: 11, fontWeight: '600', color: '#A78BFA' },
  valorContainer: {
    backgroundColor: '#21183A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  valor: { color: '#D8B4FE', fontWeight: '800', fontSize: 14 },
});