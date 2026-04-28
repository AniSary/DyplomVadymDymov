/**
 * Serwis do pracy z lokalnym magazynem (AsyncStorage)
 * Przechowuje transakcje, kategorie i ustawienia
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants/categories';
import { DEFAULT_CURRENCY } from '../constants/currencies';

// Klucze dla magazynu
const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  FIRST_LAUNCH: 'first_launch',
};

// Domyślne ustawienia
const DEFAULT_SETTINGS = {
  currency: DEFAULT_CURRENCY,
  theme: 'light',
  notifications: true,
  language: 'pl', // domyślny język: polski
};

// Backend storage: use AsyncStorage on native, fallback to window.localStorage on web
const StorageBackend = (typeof Platform !== 'undefined' && Platform.OS === 'web') || !AsyncStorage || typeof AsyncStorage.getItem !== 'function'
  ? {
      getItem: async (key) => {
        try {
          return window.localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      },
      setItem: async (key, value) => {
        return window.localStorage.setItem(key, value);
      },
      removeItem: async (key) => {
        return window.localStorage.removeItem(key);
      },
    }
  : AsyncStorage;

class StorageService {
  /**
   * Inicjalizacja magazynu (przy pierwszym uruchomieniu)
   */
  async initialize() {
    try {
      const firstLaunch = await StorageBackend.getItem(STORAGE_KEYS.FIRST_LAUNCH);
      
      if (!firstLaunch) {
        // Pierwsze uruchomienie - inicjalizacja danych
        // Zapisujemy сначала сами данные, затем выставляем флаг первого запуска,
        // чтобы избежать состояния гонки, когда флаг установлен, а данные ещё не записаны.
        await StorageBackend.setItem(
          STORAGE_KEYS.CATEGORIES,
          JSON.stringify([...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES])
        );
        await StorageBackend.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(DEFAULT_SETTINGS)
        );
        await StorageBackend.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
        await StorageBackend.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'true');
      }
      
      return true;
    } catch (error) {
      console.error('Storage initialization error:', error);
      return false;
    }
  }

  // ==================== TRANSAKCJE ====================

  /**
   * Pobierz wszystkie transakcje
   */
  async getTransactions() {
    try {
      const data = await StorageBackend.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Get transactions error:', error);
      return [];
    }
  }

  /**
   * Dodaj nową transakcję
   */
  async addTransaction(transaction) {
    try {
      const transactions = await this.getTransactions();
      const newTransaction = {
        id: `${Date.now()}_${Math.random()}`,
        createdAt: new Date().toISOString(),
        ...transaction,
      };
      
      transactions.push(newTransaction);
      await StorageBackend.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      
      return newTransaction;
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    }
  }

  /**
   * Zaktualizuj transakcję
   */
  async updateTransaction(id, updates) {
    try {
      const transactions = await this.getTransactions();
      const index = transactions.findIndex(t => t.id === id);
      
      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        await StorageBackend.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        return transactions[index];
      }
      
      throw new Error('Transaction not found');
    } catch (error) {
      console.error('Update transaction error:', error);
      throw error;
    }
  }

  /**
   * Usuń transakcję
   */
  async deleteTransaction(id) {
    try {
      const transactions = await this.getTransactions();
      const filtered = transactions.filter(t => t.id !== id);
      
      await StorageBackend.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Delete transaction error:', error);
      throw error;
    }
  }

  /**
   * Pobierz transakcje z zakresu dat
   */
  async getTransactionsByDateRange(startDate, endDate) {
    try {
      const transactions = await this.getTransactions();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
    } catch (error) {
      console.error('Get transactions by date range error:', error);
      return [];
    }
  }

  // ==================== KATEGORIE ====================

  /**
   * Pobierz wszystkie kategorie
   */
  async getCategories() {
    try {
      const data = await StorageBackend.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  }

  /**
   * Pobierz kategorie według typu
   */
  async getCategoriesByType(type) {
    try {
      const categories = await this.getCategories();
      return categories.filter(c => c.type === type);
    } catch (error) {
      console.error('Get categories by type error:', error);
      return [];
    }
  }

  /**
   * Dodaj nową kategorię
   */
  async addCategory(category) {
    try {
      const categories = await this.getCategories();
      const newCategory = {
        id: `${Date.now()}_${Math.random()}`,
        ...category,
      };
      
      categories.push(newCategory);
      await StorageBackend.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      
      return newCategory;
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  }

  /**
   * Zaktualizuj kategorię
   */
  async updateCategory(id, updates) {
    try {
      const categories = await this.getCategories();
      const index = categories.findIndex(c => c.id === id);
      
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates };
        
        await StorageBackend.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        return categories[index];
      }
      
      throw new Error('Category not found');
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  }

  /**
   * Usuń kategorię
   */
  async deleteCategory(id) {
    try {
      const categories = await this.getCategories();
      const filtered = categories.filter(c => c.id !== id);

      await StorageBackend.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
      // Возвращаем обновлённый список для удобства вызывающего кода
      return filtered;
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }

  // ==================== USTAWIENIA ====================

  /**
   * Pobierz wszystkie ustawienia
   */
  async getSettings() {
    try {
      const data = await StorageBackend.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Get settings error:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Zaktualizuj ustawienia
   */
  async updateSettings(updates) {
    try {
      const settings = await this.getSettings();
      const updated = { ...settings, ...updates };
      
      await StorageBackend.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  /**
   * Pobierz walutę
   */
  async getCurrency() {
    try {
      const settings = await this.getSettings();
      return settings.currency || DEFAULT_CURRENCY;
    } catch (error) {
      console.error('Get currency error:', error);
      return DEFAULT_CURRENCY;
    }
  }

  /**
   * Ustaw walutę
   */
  async setCurrency(currency) {
    return this.updateSettings({ currency });
  }

  /**
   * Pobierz motyw
   */
  async getTheme() {
    try {
      const settings = await this.getSettings();
      return settings.theme || 'light';
    } catch (error) {
      console.error('Get theme error:', error);
      return 'light';
    }
  }

  /**
   * Ustaw motyw
   */
  async setTheme(theme) {
    return this.updateSettings({ theme });
  }

  /**
   * Pobierz język
   */
  async getLanguage() {
    try {
      const settings = await this.getSettings();
      return settings.language || 'pl';
    } catch (error) {
      console.error('Get language error:', error);
      return 'pl';
    }
  }

  /**
   * Ustaw język
   */
  async setLanguage(language) {
    return this.updateSettings({ language });
  }

  // ==================== OPERACJE OGÓLNE ====================

  /**
   * Pełne zresetowanie wszystkich danych
   */
  async resetAllData() {
    try {
      await StorageBackend.removeItem(STORAGE_KEYS.TRANSACTIONS);
      await StorageBackend.removeItem(STORAGE_KEYS.CATEGORIES);
      await StorageBackend.removeItem(STORAGE_KEYS.SETTINGS);
      await StorageBackend.removeItem(STORAGE_KEYS.FIRST_LAUNCH);
      
      // Ponowna inicjalizacja
      await this.initialize();

      // Zwracamy aktualne dane po inicjalizacji, aby wywołujący mógł natychmiast zaktualizować stan
      const [transactions, categories, settings] = await Promise.all([
        this.getTransactions(),
        this.getCategories(),
        this.getSettings(),
      ]);

      return { transactions, categories, settings };
    } catch (error) {
      console.error('Reset data error:', error);
      throw error;
    }
  }

  /**
   * Eksportuj wszystkie dane
   */
  async exportData() {
    try {
      const transactions = await this.getTransactions();
      const categories = await this.getCategories();
      const settings = await this.getSettings();
      
      return {
        transactions,
        categories,
        settings,
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Export data error:', error);
      throw error;
    }
  }

  /**
   * Importuj dane
   */
  async importData(data) {
    try {
      if (data.transactions) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.TRANSACTIONS,
          JSON.stringify(data.transactions)
        );
      }
      
      if (data.categories) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.CATEGORIES,
          JSON.stringify(data.categories)
        );
      }
      
      if (data.settings) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SETTINGS,
          JSON.stringify(data.settings)
        );
      }
      
      return true;
    } catch (error) {
      console.error('Import data error:', error);
      throw error;
    }
  }
}

// Экспортируем синглтон
export default new StorageService();
