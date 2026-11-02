import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';

const getDataFormatada = (data) => new Date(data).toLocaleDateString('pt-BR');

// Adicionada a propriedade 'largura'
export default function DespesaItem({ id, description, amount, date, category, largura }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const currentTheme = theme[colorScheme] || theme.dark;

  function itemPressHandler() {
    navigation.navigate('GerenciarDespesa', { expenseId: id });
  }

  return (
    <Pressable
      onPress={itemPressHandler}
      style={({ pressed }) => [
        styles.itemContainer,
        { backgroundColor: currentTheme.card, borderColor: currentTheme.border },
        // Aplica a largura (ex: 90%) e força a centralização se estiver em 1 coluna
        largura ? { width: largura, alignSelf: 'center' } : { width: '100%' },
        pressed && styles.pressed
      ]}
    >
      <View style={styles.infoContainer}>
        <Text style={[styles.descricao, { color: currentTheme.textPrimary }]}>{description}</Text>
        <Text style={[styles.data, { color: currentTheme.textSecondary }]}>{getDataFormatada(date)}</Text>
      </View>
      
      <View style={styles.valoresContainer}>
        <View style={[styles.categoriaTag, { backgroundColor: currentTheme.inputBackground }]}>
          <Text style={[styles.categoriaTexto, { color: currentTheme.primary }]}>{category}</Text>
        </View>
        <View style={[styles.valorContainer, { backgroundColor: '#21183A' }]}>
          <Text style={styles.valor}>R$ {amount.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    // marginVertical: 8 foi removido daqui para o 'gap' fazer o trabalho de forma limpa
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
      android: { elevation: 3 },
    }),
  },
  pressed: { opacity: 0.7 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  descricao: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  data: { fontSize: 13, fontWeight: '600' },
  valoresContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  categoriaTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  categoriaTexto: { fontSize: 11, fontWeight: '600' },
  valorContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  valor: { color: '#D8B4FE', fontWeight: '800', fontSize: 14 },
});