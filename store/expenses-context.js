import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpensesContext = createContext();

// Reducer que trata as ações retornando sempre um novo array (imutabilidade)
function expensesReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      return [{ ...action.payload, id: Math.random().toString() }, ...state];
    case 'UPDATE':
      const updatableExpenseIndex = state.findIndex((expense) => expense.id === action.payload.id);
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

export function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega os dados salvos ao iniciar
  useEffect(() => {
    async function loadExpenses() {
      try {
        const storedExpenses = await AsyncStorage.getItem('@expenses');
        if (storedExpenses) {
          dispatch({ type: 'SET', payload: JSON.parse(storedExpenses) });
        }
      } catch (error) {
        console.error('Erro ao carregar despesas', error);
      } finally {
        setIsLoaded(true); // Marca que o carregamento inicial terminou
      }
    }
    loadExpenses();
  }, []);

  // Salva os dados a cada alteração, caso o carregamento inicial já tenha ocorrido
  useEffect(() => {
    async function saveExpenses() {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('@expenses', JSON.stringify(expensesState));
        } catch (error) {
          console.error('Erro ao salvar despesas', error);
        }
      }
    }
    saveExpenses();
  }, [expensesState, isLoaded]);

  function addExpense(expenseData) {
    dispatch({ type: 'ADD', payload: expenseData });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: 'UPDATE', payload: { id, data: expenseData } });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function clearExpenses() {
    dispatch({ type: 'SET', payload: [] });
  }

  const value = {
    expenses: expensesState,
    addExpense,
    updateExpense,
    deleteExpense,
    clearExpenses,
  };

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

// Hook personalizado com validação de uso
export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses deve ser usado dentro de um ExpensesContextProvider');
  }
  return context;
}