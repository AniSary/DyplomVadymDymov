/**
 * Nawigacja aplikacji
 * Używa React Navigation z dolnym paskiem nawigacji między ekranami
 */

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';

import {
  SplashScreen,
  DashboardScreen,
  AddTransactionScreen,
  TransactionsScreen,
  CategoriesScreen,
  StatisticsScreen,
  SettingsScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Stos głównego ekranu (Dashboard z możliwością dodawania transakcji)
 */
const DashboardStack = () => {
  const { theme } = useApp();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

/**
 * Stos ekranu transakcji
 */
const TransactionsStack = () => {
  const { theme } = useApp();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="TransactionsList" component={TransactionsScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </Stack.Navigator>
  );
};

/**
 * Główna nawigacja (główne zakładki)
 */
const MainStack = () => {
  const { theme, t } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: -6,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tab.Screen
        name="DashboardStack"
        component={DashboardStack}
        options={{
          title: t('Home') || 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💰</Text>,
        }}
      />

      <Tab.Screen
        name="TransactionsStack"
        component={TransactionsStack}
        options={{
          title: t('Transactions') || 'Transactions',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📋</Text>,
        }}
      />

      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: t('Statistics') || 'Statistics',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📊</Text>,
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: t('Categories') || 'Categories',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📁</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Nawigacja główna (stos dla ekranu Splash)
 */
export const RootNavigator = () => {
  const { theme } = useApp();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
};

/**
 * Główny kontener nawigacji
 */
export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
