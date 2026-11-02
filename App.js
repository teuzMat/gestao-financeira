import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import DespesasRecentes from './screens/DespesasRecentes';
import TodasDespesas from './screens/TodasDespesas';
import GerenciarDespesa from './screens/GerenciarDespesa';
import IconButton from './components/IconButton';
import { ExpensesContextProvider } from './store/expenses-context'; // Importação do Contexto

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomHeader = ({ titulo, showBack, navigation, showAdd }) => (
  <SafeAreaView style={styles.headerSafeArea}>
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {showBack && (
            <View style={{ marginRight: 16 }}>
              <IconButton icon="arrow-back" size={24} color="#A78BFA" onPress={() => navigation.goBack()} />
            </View>
          )}
          <Text style={styles.headerTitle}>{titulo}</Text>
        </View>
        
        {showAdd && (
          <IconButton icon="add" size={28} color="#A78BFA" onPress={() => navigation.navigate('GerenciarDespesa')} />
        )}
      </View>
    </View>
  </SafeAreaView>
);

function BottomTabScreen({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#151A27', borderTopColor: '#202638' },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        header: ({ options }) => (
          <CustomHeader titulo={options.title} navigation={navigation} showAdd={true} />
        ),
      }}
    >
      <Tab.Screen
        name="DespesasRecentes"
        component={DespesasRecentes}
        options={{ title: "Despesas Recentes", tabBarLabel: "Recentes", tabBarIcon: ({ color, size }) => <Ionicons name="hourglass" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="TodasDespesas"
        component={TodasDespesas}
        options={{ title: "Todas as Despesas", tabBarLabel: "Todas", tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ExpensesContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#0B0F19' } }}>
          <Stack.Screen name="Despesas" component={BottomTabScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="GerenciarDespesa"
            component={GerenciarDespesa}
            options={({ navigation, route }) => {
              // Verifica se estamos a editar ou a criar
              const isEditing = !!route.params?.expenseId;
              return {
                header: () => (
                  <CustomHeader 
                    titulo={isEditing ? "Editar despesa" : "Nova despesa"} 
                    navigation={navigation} 
                    showBack={true} 
                  />
                ),
              };
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpensesContextProvider>
  );
}

const styles = StyleSheet.create({
  headerSafeArea: { backgroundColor: '#0B0F19' },
  headerContainer: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#202638' },
  headerContent: { width: '100%', maxWidth: 900, paddingHorizontal: 24, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
});