/**
 * Контекст приложения для управления состоянием
 * Хранит транзакции, категории, настройки и методы для их обновления
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import StorageService from '../services/StorageService';
import { t as translate, getSupportedLanguages } from '../utils/i18n';
import { lightTheme, darkTheme } from '../constants/colors';
import { isThisMonth } from '../utils/dateUtils';
import {
  calculateBalance,
  calculateMonthlyExpenses,
  calculateMonthlyIncome,
} from '../utils/moneyUtils';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [appInitialized, setAppInitialized] = useState(false);

  // ==================== ИНИЦИАЛИЗАЦИЯ ====================

  /**
   * Загрузить все данные при запуске приложения
   */
  const initializeApp = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Инициализируем хранилище
      await StorageService.initialize();
      
      // Загружаем все данные
      const [loadedTransactions, loadedCategories, loadedSettings] = await Promise.all([
        StorageService.getTransactions(),
        StorageService.getCategories(),
        StorageService.getSettings(),
      ]);
      
      setTransactions(loadedTransactions);
      setCategories(loadedCategories);
      setSettings(loadedSettings);
      setAppInitialized(true);
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Инициализируем приложение при монтировании
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // ==================== ТРАНЗАКЦИИ ====================

  const addTransaction = useCallback(async (transaction) => {
    try {
      const newTransaction = await StorageService.addTransaction(transaction);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    }
  }, []);

  const updateTransaction = useCallback(async (id, updates) => {
    try {
      const updated = await StorageService.updateTransaction(id, updates);
      setTransactions(prev =>
        prev.map(t => (t.id === id ? updated : t))
      );
      return updated;
    } catch (error) {
      console.error('Update transaction error:', error);
      throw error;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await StorageService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Delete transaction error:', error);
      throw error;
    }
  }, []);

  const getTransactionsByDateRange = useCallback(async (startDate, endDate) => {
    return StorageService.getTransactionsByDateRange(startDate, endDate);
  }, []);

  // ==================== КАТЕГОРИИ ====================

  const addCategory = useCallback(async (category) => {
    try {
      const newCategory = await StorageService.addCategory(category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  }, []);

  const updateCategory = useCallback(async (id, updates) => {
    try {
      const updated = await StorageService.updateCategory(id, updates);
      setCategories(prev =>
        prev.map(c => (c.id === id ? updated : c))
      );
      return updated;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      await StorageService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }, []);

  const getCategoryById = useCallback((id) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  const getCategoriesByType = useCallback((type) => {
    return categories.filter(c => c.type === type);
  }, [categories]);

  // ==================== НАСТРОЙКИ ====================

  const updateSettings = useCallback(async (updates) => {
    try {
      const updated = await StorageService.updateSettings(updates);
      setSettings(updated);
      return updated;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }, []);

  const setCurrency = useCallback((currency) => {
    return updateSettings({ currency });
  }, [updateSettings]);

  const setTheme = useCallback((theme) => {
    return updateSettings({ theme });
  }, [updateSettings]);

  const setLanguage = useCallback((language) => {
    return updateSettings({ language });
  }, [updateSettings]);

  const t = useCallback((key) => {
    const lang = (settings && settings.language) ? settings.language : 'pl';
    return translate(key, lang);
  }, [settings]);

  const supportedLanguages = getSupportedLanguages();

  // Вычисляем тему на основе настроек
  const theme = settings && settings.theme === 'dark' ? darkTheme : lightTheme;
  const language = settings && settings.language ? settings.language : 'pl';

  // ==================== СТАТИСТИКА ====================

  const getBalance = useCallback(() => {
    return calculateBalance(transactions);
  }, [transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const monthlyTransactions = transactions.filter(t => isThisMonth(t.date));
    return calculateMonthlyExpenses(monthlyTransactions);
  }, [transactions]);

  const getMonthlyIncome = useCallback(() => {
    const monthlyTransactions = transactions.filter(t => isThisMonth(t.date));
    return calculateMonthlyIncome(monthlyTransactions);
  }, [transactions]);

  const getExpensesByCategory = useCallback((monthDate = new Date()) => {
    const monthTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return (
        transDate.getMonth() === monthDate.getMonth() &&
        transDate.getFullYear() === monthDate.getFullYear() &&
        t.type === 'expense'
      );
    });

    const grouped = {};
    monthTransactions.forEach(t => {
      if (!grouped[t.categoryId]) {
        grouped[t.categoryId] = 0;
      }
      grouped[t.categoryId] += parseFloat(t.amount);
    });

    return grouped;
  }, [transactions]);

  const getIncomeByCategory = useCallback((monthDate = new Date()) => {
    const monthTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return (
        transDate.getMonth() === monthDate.getMonth() &&
        transDate.getFullYear() === monthDate.getFullYear() &&
        t.type === 'income'
      );
    });

    const grouped = {};
    monthTransactions.forEach(t => {
      if (!grouped[t.categoryId]) {
        grouped[t.categoryId] = 0;
      }
      grouped[t.categoryId] += parseFloat(t.amount);
    });

    return grouped;
  }, [transactions]);

  // ==================== ДАННЫЕ ====================

  const resetAllData = useCallback(async () => {
    try {
      await StorageService.resetAllData();
      await initializeApp();
    } catch (error) {
      console.error('Reset data error:', error);
      throw error;
    }
  }, [initializeApp]);

  const exportData = useCallback(async () => {
    return StorageService.exportData();
  }, []);

  const importData = useCallback(async (data) => {
    try {
      await StorageService.importData(data);
      await initializeApp();
    } catch (error) {
      console.error('Import data error:', error);
      throw error;
    }
  }, [initializeApp]);

  const value = {
    // Состояние
    isLoading,
    appInitialized,
    transactions,
    categories,
    settings,

    // Транзакции
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,

    // Категории
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesByType,

    // Настройки
    updateSettings,
    setCurrency,
    setTheme,
    setLanguage,
    t,
    supportedLanguages,
    theme,
    language,

    // Статистика
    getBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    getExpensesByCategory,
    getIncomeByCategory,

    // Данные
    resetAllData,
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Хук для использования контекста приложения
 */
export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
