import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, MD3LightTheme, Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HabitsScreen from './src/screens/HabitsScreen';
import TodosScreen from './src/screens/TodosScreen';

const Tab = createBottomTabNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Habits') {
                  iconName = 'fire';
                } else if (route.name === 'Todos') {
                  iconName = 'checkbox-marked-circle-outline';
                }
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen 
              name="Habits" 
              component={HabitsScreen}
              options={{ title: 'HabitFlow - Habits' }}
            />
            <Tab.Screen 
              name="Todos" 
              component={TodosScreen}
              options={{ title: 'HabitFlow - Todos' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
