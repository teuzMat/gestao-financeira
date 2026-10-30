import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Pressable, Alert, Platform, 
  KeyboardAvoidingView, ScrollView, Modal, SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import GlobalWrapper from '../components/GlobalWrapper';
import { useExpenses } from '../store/expenses-context';

const CATEGORIES = ['Alimentação', 'Transporte', 'Lazer', 'Contas'];

export default function GerenciarDespesa({ route, navigation }) {
  const expensesCtx = useExpenses();
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId; // Se existe ID, estamos no modo edição

  // Encontra a despesa selecionada (se estiver no modo edição)
  const selectedExpense = isEditing 
    ? expensesCtx.expenses.find(e => e.id === expenseId)
    : null;

  // 1. Estado único do formulário
  const [form, setForm] = useState({
    description: selectedExpense ? selectedExpense.description : '',
    amount: selectedExpense ? selectedExpense.amount.toString() : '',
    date: selectedExpense ? new Date(selectedExpense.date) : new Date(),
    category: selectedExpense ? selectedExpense.category : ''
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Função genérica para atualizar o estado do formulário usando spread operator
  function handleChange(field, value) {
    if (field === 'amount') {
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) return;
    }
    
    setForm(prev => ({ ...prev, [field]: value }));
    // Limpa o erro do campo ao começar a digitar/corrigir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }

  // 2. Validação do formulário
  function validate(values) {
    let newErrors = {};
    
    if (!values.description || values.description.trim().length < 3) {
      newErrors.description = 'A descrição deve ter no mínimo 3 caracteres.';
    }
    
    const parsedAmount = parseFloat(values.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'O valor deve ser maior que zero.';
    }
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (values.date > today) {
      newErrors.date = 'A data não pode ser futura.';
    }
    
    if (!values.category) {
      newErrors.category = 'A categoria é obrigatória.';
    }
    
    return newErrors;
  }

  function saveHandler() {
    const validationErrors = validate(form);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Bloqueia o salvamento se houver erros
    }

    const expenseData = {
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date.toISOString(),
      category: form.category
    };

    if (isEditing) {
      expensesCtx.updateExpense(expenseId, expenseData);
    } else {
      expensesCtx.addExpense(expenseData);
    }
    navigation.goBack();
  }

  function deleteHandler() {
    Alert.alert('Excluir Despesa', 'Tem a certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: () => {
          expensesCtx.deleteExpense(expenseId);
          navigation.goBack();
        } 
      }
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      {/* UX: Teclado não cobre os campos */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GlobalWrapper>
            <View style={styles.formContainer}>
              
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, errors.description && styles.inputError]}
                value={form.description}
                onChangeText={(val) => handleChange('description', val)}
                placeholder="Ex: Almoço"
                placeholderTextColor="#6B7280"
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                value={form.amount}
                onChangeText={(val) => handleChange('amount', val)}
                placeholder="Ex: 25.50"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

              <Text style={styles.label}>Data</Text>
              <Pressable 
                style={[styles.datePickerButton, errors.date && styles.inputError]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>{form.date.toLocaleDateString('pt-BR')}</Text>
              </Pressable>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
              
              {showDatePicker && (
                <DateTimePicker
                  value={form.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) handleChange('date', selectedDate);
                  }}
                />
              )}

              <Text style={styles.label}>Categoria</Text>
              {/* UX: Modal transparente para a categoria */}
              <Pressable 
                style={[styles.input, errors.category && styles.inputError, { justifyContent: 'center' }]} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={[styles.datePickerText, !form.category && { color: '#6B7280' }]}>
                  {form.category || 'Selecione uma categoria'}
                </Text>
              </Pressable>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

              <View style={styles.buttonsContainer}>
                <Pressable style={styles.submitButton} onPress={saveHandler}>
                  <Text style={styles.submitButtonText}>Salvar Despesa</Text>
                </Pressable>

                {/* Mostra botão excluir apenas na edição */}
                {isEditing && (
                  <Pressable style={styles.deleteButton} onPress={deleteHandler}>
                    <Ionicons name="trash" size={24} color="#EF4444" />
                  </Pressable>
                )}
              </View>

            </View>
          </GlobalWrapper>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Categorias */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.modalItem, form.category === cat && styles.modalItemActive]}
                onPress={() => {
                  handleChange('category', cat);
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.modalItemText, form.category === cat && styles.modalItemTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  formContainer: { flex: 1, width: '100%', paddingTop: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16, color: '#D1D5DB' },
  input: { 
    borderWidth: 1, borderColor: '#202638', borderRadius: 12, 
    padding: 14, fontSize: 15, color: '#FFFFFF', backgroundColor: '#1B2130', fontWeight: '400',
    minHeight: 52
  },
  inputError: { borderColor: '#EF4444' }, // Borda vermelha se houver erro
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' },
  datePickerButton: { 
    borderWidth: 1, borderColor: '#202638', borderRadius: 12, 
    padding: 14, alignItems: 'flex-start', backgroundColor: '#1B2130' 
  },
  datePickerText: { color: '#FFFFFF', fontSize: 15, fontWeight: '400' },
  buttonsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 40, gap: 16 },
  submitButton: { 
    flex: 1, backgroundColor: '#7C3AED', padding: 16, borderRadius: 14, 
    alignItems: 'center',
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  deleteButton: {
    padding: 14, backgroundColor: '#1B2130', borderRadius: 14,
    borderWidth: 1, borderColor: '#202638', alignItems: 'center', justifyContent: 'center'
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#151A27', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#202638' },
  modalItemActive: { backgroundColor: '#1B2130', borderRadius: 12, paddingHorizontal: 12, borderBottomWidth: 0, marginVertical: 4 },
  modalItemText: { color: '#D1D5DB', fontSize: 16, textAlign: 'center' },
  modalItemTextActive: { color: '#A78BFA', fontWeight: 'bold' },
  modalCancel: { marginTop: 16, paddingVertical: 16, alignItems: 'center' },
  modalCancelText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' }
});