/**
 * Контекст приложения для управления состоянием
 * Хранит транзакции, категории, настройки и методы для их обновления
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import StorageService from '../services/StorageService';
import { t as translate, tAuto, addTranslationToCache, addAutoTranslatePair, getSupportedLanguages } from '../utils/i18n';
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
      
      // Если категория имеет поле name (прямое название), добавляем переводы
      if (newCategory.name) {
        // Генерируем переводы для других языков
        const translations_map = {
          en: newCategory.name,
          pl: tAuto(newCategory.name, 'pl', 'en'),
          ru: tAuto(newCategory.name, 'ru', 'en'),
        };
        
        // Добавляем переводы в кэш
        addTranslationToCache(newCategory.name, translations_map);
      }
      
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
      const updated = await StorageService.deleteCategory(id);
      if (updated && Array.isArray(updated)) {
        setCategories(updated);
      } else {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
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

  /**
   * Получить переведённое название категории
   * Если есть nameKey — использует его как ключ для перевода
   * Если нет — переводит прямое название (name) через tAuto
   */
  const getCategoryName = useCallback((category, language) => {
    const lang = language || (settings && settings.language) ? settings.language : 'pl';
    
    if (!category) return 'Unknown';
    
    // Если есть nameKey, используем его как ключ для локализации
    if (category.nameKey) {
      return translate(category.nameKey, lang);
    }
    
    // Если есть name, переводим его автоматически
    if (category.name) {
      // Предполагаем, что имя введено на английском языке
      return tAuto(category.name, lang, 'en');
    }
    
    return 'Unknown';
  }, [settings]);

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

  /**
   * Функция для автоматического перевода динамических текстов
   * Используется для названий категорий, продуктов и других пользовательских значений
   */
  const tAutoTranslate = useCallback((text, sourceLang = 'en') => {
    const lang = (settings && settings.language) ? settings.language : 'pl';
    return tAuto(text, lang, sourceLang);
  }, [settings]);

  const supportedLanguages = getSupportedLanguages();

  // Вычисляем тему на основе настроек
  const theme = settings && settings.theme === 'dark' ? darkTheme : lightTheme;
  const language = settings && settings.language ? settings.language : 'pl';

  // ==================== СТАТИСТИКА ====================

  const getBalance = useCallback(() => {
    return calculateBalance(transactions);
  }, [transactions]);

  const getMonthlyExpenses = useCallback((monthDate = new Date()) => {
    const monthlyTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return (
        transDate.getMonth() === monthDate.getMonth() &&
        transDate.getFullYear() === monthDate.getFullYear() &&
        t.type === 'expense'
      );
    });
    return calculateMonthlyExpenses(monthlyTransactions);
  }, [transactions]);

  const getMonthlyIncome = useCallback((monthDate = new Date()) => {
    const monthlyTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return (
        transDate.getMonth() === monthDate.getMonth() &&
        transDate.getFullYear() === monthDate.getFullYear() &&
        t.type === 'income'
      );
    });
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
      const result = await StorageService.resetAllData();
      if (result && typeof result === 'object') {
        setTransactions(result.transactions || []);
        setCategories(result.categories || []);
        setSettings(result.settings || {});
        setAppInitialized(true);
      } else {
        // Fallback: re-run full initialization
        await initializeApp();
      }
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
    getCategoryName,

    // Настройки
    updateSettings,
    setCurrency,
    setTheme,
    setLanguage,
    t,
    tAutoTranslate,
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
