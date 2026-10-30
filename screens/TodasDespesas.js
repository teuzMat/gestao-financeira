import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalWrapper from '../components/GlobalWrapper';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../constants/theme';

export default function TodasDespesas() {
  const expensesContext = useExpenses();
  const colorScheme = useColorScheme(); // Exigência da Tarefa 4 (uso de useColorScheme)
  const currentTheme = theme[colorScheme] || theme.dark;

  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busca, setBusca] = useState('');
  
  // Atraso de 500ms na digitação para não travar a lista
  const buscaDebounced = useDebounce(busca, 500);
  
  const categoriasFiltro = ['Todas', 'Alimentação', 'Transporte', 'Lazer', 'Contas'];

  // Combinação dos dois filtros utilizando useMemo para performance
  const despesasFiltradas = useMemo(() => {
    return expensesContext.expenses.filter((despesa) => {
      const matchCategoria = categoriaFiltro === 'Todas' || despesa.category === categoriaFiltro;
      const matchBusca = despesa.description.toLowerCase().includes(buscaDebounced.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [expensesContext.expenses, categoriaFiltro, buscaDebounced]);

  // Desafio Extra: Limpar Tudo
  function limparTudoHandler() {
    Alert.alert('Atenção!', 'Tem a certeza que deseja excluir TODAS as despesas? Esta ação é irreversível.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar Tudo', style: 'destructive', onPress: () => expensesContext.clearExpenses() }
    ]);
  }

  return (
    <GlobalWrapper>
      <View style={styles.container}>
        
        {/* Barra de Pesquisa e Botão Limpar */}
        <View style={styles.headerAcoes}>
          <View style={[styles.buscaContainer, { backgroundColor: currentTheme.inputBackground, borderColor: currentTheme.border }]}>
            <Ionicons name="search" size={20} color={currentTheme.textSecondary} />
            <TextInput
              style={[styles.inputBusca, { color: currentTheme.textPrimary }]}
              placeholder="Buscar despesa..."
              placeholderTextColor={currentTheme.textSecondary}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          
          {expensesContext.expenses.length > 0 && (
            <Pressable style={styles.limparBotao} onPress={limparTudoHandler}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          )}
        </View>

        {/* Filtro de Categorias (Chips) */}
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

        <DespesaSaida despesas={despesasFiltradas} periodoNome="Total Exibido" />
      </View>
    </GlobalWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  headerAcoes: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingHorizontal: 8 },
  buscaContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    borderRadius: 12, borderWidth: 1, height: 48
  },
  inputBusca: { flex: 1, marginLeft: 8, fontSize: 15 },
  limparBotao: {
    width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#451a1a', 
    backgroundColor: '#2a1215', justifyContent: 'center', alignItems: 'center'
  },
  filtrosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20, paddingHorizontal: 8 },
  filtroBotao: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
    backgroundColor: '#1B2130', borderWidth: 1, borderColor: '#202638',
  },
  filtroBotaoAtivo: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  filtroTexto: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  filtroTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
});