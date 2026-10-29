import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GlobalWrapper from '../components/GlobalWrapper'; // Importando o layout global

export default function GerenciarDespesa({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categoriasDisponiveis = ['Alimentação', 'Transporte', 'Lazer', 'Contas'];

  const tratarMudancaValor = (texto) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(texto)) setValor(texto);
  };

  const salvarDespesa = () => {
    if (!descricao.trim() || !valor.trim() || !categoria) {
      Alert.alert('Erro de Validação', 'Por favor, preencha descrição, valor e selecione uma categoria.');
      return;
    }
    const novaDespesa = { id: Math.random().toString(), descricao, valor: parseFloat(valor), categoria, data: data.toISOString() };
    console.log('Despesa salva:', novaDespesa);
    navigation.goBack();
  };

  return (
    <GlobalWrapper>
      <View style={styles.container}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex: Almoço"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={tratarMudancaValor}
          placeholder="Ex: 25.50"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Data</Text>
        <Pressable style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>{data.toLocaleDateString('pt-BR')}</Text>
        </Pressable>
        
        {showDatePicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setData(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriasContainer}>
          {categoriasDisponiveis.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.categoriaButton, categoria === cat && styles.categoriaButtonAtiva]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.categoriaTexto, categoria === cat && styles.categoriaTextoAtivo]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.submitButton} onPress={salvarDespesa}>
          <Text style={styles.submitButtonText}>Salvar Despesa</Text>
        </Pressable>
      </View>
    </GlobalWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 20, color: '#D1D5DB' },
  input: { 
    borderWidth: 1, borderColor: '#202638', borderRadius: 12, 
    padding: 14, fontSize: 15, color: '#FFFFFF', backgroundColor: '#1B2130', fontWeight: '400' 
  },
  datePickerButton: { 
    borderWidth: 1, borderColor: '#202638', borderRadius: 12, 
    padding: 14, alignItems: 'center', backgroundColor: '#1B2130' 
  },
  datePickerText: { color: '#FFFFFF', fontSize: 15, fontWeight: '400' },
  categoriasContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoriaButton: { 
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, 
    backgroundColor: '#1B2130', borderWidth: 1, borderColor: '#202638' 
  },
  categoriaButtonAtiva: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  categoriaTexto: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  categoriaTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
  submitButton: { 
    backgroundColor: '#7C3AED', padding: 16, borderRadius: 14, 
    alignItems: 'center', marginTop: 40,
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});