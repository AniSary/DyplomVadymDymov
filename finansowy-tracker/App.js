/**
 * Главное приложение Финансово Трекер
 * Мобильное приложение для управления личными финансами
 * 
 * Архитектура:
 * - AppProvider: управление состоянием приложения
 * - Navigation: маршрутизация между экранами
 * - AsyncStorage: локальное хранилище данных
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { Navigation } from './src/navigation/Navigation';

// Внутренний компонент для доступа к контексту (тему)
const AppContent = () => {
  const { theme } = useApp();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Navigation />
      <StatusBar barStyle={theme.background === '#FFFFFF' ? 'dark' : 'light'} backgroundColor={theme.background} hidden={false} />
    </View>
  );
};

/**
 * Основной компонент приложения
 */
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
