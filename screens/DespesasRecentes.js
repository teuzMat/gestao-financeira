import React from 'react';
import { View, StyleSheet } from 'react-native';
import GlobalWrapper from '../components/GlobalWrapper';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';

export default function DespesasRecentes() {
  const expensesContext = useExpenses();

  // Filtra as despesas globais para retornar apenas as dos últimos 7 dias
  const recentExpenses = expensesContext.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const expenseDate = new Date(expense.date);
    
    return expenseDate >= date7DaysAgo && expenseDate <= today;
  });

  return (
    <GlobalWrapper>
      <View style={styles.container}>
        <DespesaSaida 
          despesas={recentExpenses} 
          periodoNome="Últimos 7 Dias" 
        />
      </View>
    </GlobalWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
});