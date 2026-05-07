// src/services/SyncService.js
// Сервис синхронизации между мобильным клиентом и backend сервером

import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export class SyncService {
  constructor(userId, deviceId = null) {
    this.userId = userId;
    this.deviceId = deviceId || uuidv4();
    this.lastSyncTime = null;
  }

  // ============ ОСНОВНЫЕ ОПЕРАЦИИ СИНХРОНИЗАЦИИ ============

  /**
   * Отправить локальные изменения на сервер
   */
  async pushChanges(transactions) {
    try {
      const response = await fetch(`${API_BASE_URL}/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.userId
        },
        body: JSON.stringify({
          transactions: transactions.map(t => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            category: t.category,
            description: t.description,
            date: t.date,
            version: t.version || 1,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt
          })),
          deviceId: this.deviceId,
          lastSyncTime: this.lastSyncTime
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Push failed');
      }

      this.lastSyncTime = data.serverTime;
      return {
        success: true,
        uploaded: data.results.uploaded,
        conflicts: data.results.conflicts,
        errors: data.results.errors
      };
    } catch (error) {
      console.error('Push error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Загрузить изменения с сервера
   */
  async pullChanges() {
    try {
      const response = await fetch(`${API_BASE_URL}/sync/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.userId
        },
        body: JSON.stringify({
          lastSyncTime: this.lastSyncTime,
          deviceId: this.deviceId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pull failed');
      }

      this.lastSyncTime = data.serverTime;
      return {
        success: true,
        transactions: data.data.transactions,
        deletedTransactions: data.data.deletedTransactions,
        syncLog: data.data.syncLog,
        checksum: data.checksum
      };
    } catch (error) {
      console.error('Pull error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Полная синхронизация с разрешением конфликтов
   */
  async fullSync(localTransactions) {
    try {
      const response = await fetch(`${API_BASE_URL}/sync/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.userId
        },
        body: JSON.stringify({
          localTransactions: localTransactions.map(t => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            category: t.category,
            description: t.description,
            date: t.date,
            version: t.version || 1,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt
          })),
          lastSyncTime: this.lastSyncTime,
          deviceId: this.deviceId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Merge failed');
      }

      this.lastSyncTime = data.serverTime;
      return {
        success: true,
        applied: data.results.applied,
        conflicts: data.results.conflicts,
        stats: data.stats
      };
    } catch (error) {
      console.error('Merge error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить статус синхронизации
   */
  async getStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/sync/status`, {
        headers: {
          'X-User-ID': this.userId
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Status check failed');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============ УДОБНЫЕ МЕТОДЫ ============

  /**
   * Синхронизировать одну транзакцию
   */
  async syncTransaction(transaction) {
    return this.pushChanges([transaction]);
  }

  /**
   * Установить время последней синхронизации
   */
  setLastSyncTime(time) {
    this.lastSyncTime = time;
  }

  /**
   * Сбросить время синхронизации (для полной пересинхронизации)
   */
  resetSync() {
    this.lastSyncTime = null;
  }
}

export default SyncService;
