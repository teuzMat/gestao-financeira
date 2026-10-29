import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import GlobalWrapper from '../components/GlobalWrapper';
import DespesaSaida from '../components/despesa/DespesaSaida';

// Dados fictícios para testar a filtragem e os cálculos
const DESPESAS_MOCK = [
  { id: 'd1', descricao: 'Almoço Restaurante', valor: 45.50, data: '2026-10-25', categoria: 'Alimentação' },
  { id: 'd2', descricao: 'Uber para Casa', valor: 35.00, data: '2026-10-26', categoria: 'Transporte' },
  { id: 'd3', descricao: 'Conta de Luz', valor: 150.00, data: '2026-10-27', categoria: 'Contas' },
  { id: 'd4', descricao: 'Cinema', valor: 60.00, data: '2026-10-28', categoria: 'Lazer' },
  { id: 'd5', descricao: 'Supermercado', valor: 210.00, data: '2026-10-28', categoria: 'Alimentação' },
];

export default function TodasDespesas() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  
  const categoriasFiltro = ['Todas', 'Alimentação', 'Transporte', 'Lazer', 'Contas'];

  // Função que filtra as despesas utilizando o método .filter() exigido
  const despesasFiltradas = DESPESAS_MOCK.filter((despesa) => {
    if (categoriaFiltro === 'Todas') {
      return true;
    }
    return despesa.categoria === categoriaFiltro;
  });

  return (
    <GlobalWrapper>
      <View style={styles.container}>
        {/* Menu de Filtros de Categoria */}
        <View style={styles.filtrosContainer}>
          {categoriasFiltro.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.filtroBotao, categoriaFiltro === cat && styles.filtroBotaoAtivo]}
              onPress={() => setCategoriaFiltro(cat)}
            >
              <Text style={[styles.filtroTexto, categoriaFiltro === cat && styles.filtroTextoAtivo]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Componente que renderiza o somatório e a lista com os dados filtrados */}
        <DespesaSaida despesas={despesasFiltradas} periodoNome="Total Filtrado" />
      </View>
    </GlobalWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  filtroBotao: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1B2130',
    borderWidth: 1,
    borderColor: '#202638',
  },
  filtroBotaoAtivo: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  filtroTexto: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  filtroTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
});