// src/services/DatabaseService.js
// Управление SQLite базой данных и операциями транзакций

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Transaction } from '../models/Transaction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export class DatabaseService {
  static async init(dbPath = './data/tracker.db') {
    if (db) return db;

    // Убедимся что папка существует
    const dir = path.dirname(dbPath);
    const fs = await import('fs').then(m => m.promises);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.exec('PRAGMA foreign_keys = ON');
    await this.createTables();
    return db;
  }

  static async createTables() {
    if (!db) throw new Error('Database not initialized');

    // Таблица пользователей
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Таблица транзакций с поддержкой версионирования
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        deviceId TEXT,
        isDeleted BOOLEAN DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_date (date),
        INDEX idx_version (version)
      )
    `);

    // Таблица для отслеживания синхронизации
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        deviceId TEXT NOT NULL,
        transactionId TEXT,
        action TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        version INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId_timestamp (userId, timestamp)
      )
    `);

    // Таблица для кэширования аналитики (для оптимизации)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS analytics_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        period TEXT NOT NULL,
        metric TEXT NOT NULL,
        value REAL,
        cachedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (userId, period, metric),
        INDEX idx_userId_period (userId, period)
      )
    `);
  }

  // ============ ОПЕРАЦИИ С ТРАНЗАКЦИЯМИ ============

  static async createTransaction(userId, transactionData) {
    if (!db) throw new Error('Database not initialized');

    const transaction = new Transaction({
      ...transactionData,
      userId,
      version: 1
    });

    await db.run(
      `INSERT INTO transactions 
        (id, userId, amount, type, category, description, date, version, createdAt, updatedAt, deviceId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.id,
        transaction.userId,
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.description,
        transaction.date,
        transaction.version,
        transaction.createdAt,
        transaction.updatedAt,
        transaction.deviceId
      ]
    );

    await this.logSync(userId, transaction.deviceId, transaction.id, 'CREATE', transaction.version);
    return transaction;
  }

  static async getTransaction(userId, transactionId) {
    if (!db) throw new Error('Database not initialized');

    const row = await db.get(
      `SELECT * FROM transactions WHERE id = ? AND userId = ? AND isDeleted = 0`,
      [transactionId, userId]
    );

    return row ? new Transaction(row) : null;
  }

  static async getTransactions(userId, filters = {}) {
    if (!db) throw new Error('Database not initialized');

    let query = `SELECT * FROM transactions WHERE userId = ? AND isDeleted = 0`;
    const params = [userId];

    if (filters.startDate) {
      query += ` AND date >= ?`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND date <= ?`;
      params.push(filters.endDate);
    }

    if (filters.category) {
      query += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.type) {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    query += ` ORDER BY date DESC`;

    const rows = await db.all(query, params);
    return rows.map(row => new Transaction(row));
  }

  static async updateTransaction(userId, transactionId, updates) {
    if (!db) throw new Error('Database not initialized');

    const existing = await this.getTransaction(userId, transactionId);
    if (!existing) throw new Error('Transaction not found');

    // Увеличиваем версию
    existing.incrementVersion();
    
    // Применяем обновления
    Object.assign(existing, updates);
    existing.updatedAt = new Date().toISOString();

    await db.run(
      `UPDATE transactions 
       SET amount = ?, type = ?, category = ?, description = ?, date = ?, 
           version = ?, updatedAt = ?, deviceId = ?
       WHERE id = ? AND userId = ?`,
      [
        existing.amount,
        existing.type,
        existing.category,
        existing.description,
        existing.date,
        existing.version,
        existing.updatedAt,
        existing.deviceId,
        transactionId,
        userId
      ]
    );

    await this.logSync(userId, existing.deviceId, transactionId, 'UPDATE', existing.version);
    return existing;
  }

  static async deleteTransaction(userId, transactionId) {
    if (!db) throw new Error('Database not initialized');

    const existing = await this.getTransaction(userId, transactionId);
    if (!existing) throw new Error('Transaction not found');

    // Soft delete для синхронизации
    existing.incrementVersion();
    existing.isDeleted = true;

    await db.run(
      `UPDATE transactions 
       SET isDeleted = 1, version = ?, updatedAt = ?
       WHERE id = ? AND userId = ?`,
      [existing.version, existing.updatedAt, transactionId, userId]
    );

    await this.logSync(userId, existing.deviceId, transactionId, 'DELETE', existing.version);
    return true;
  }

  // ============ СИНХРОНИЗАЦИЯ ============

  static async logSync(userId, deviceId, transactionId, action, version) {
    if (!db) throw new Error('Database not initialized');

    await db.run(
      `INSERT INTO sync_log (userId, deviceId, transactionId, action, timestamp, version)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, deviceId, transactionId, action, new Date().toISOString(), version]
    );
  }

  static async getSyncLog(userId, since = null) {
    if (!db) throw new Error('Database not initialized');

    let query = `SELECT * FROM sync_log WHERE userId = ?`;
    const params = [userId];

    if (since) {
      query += ` AND timestamp > ?`;
      params.push(since);
    }

    query += ` ORDER BY timestamp ASC`;

    const rows = await db.all(query, params);
    return rows;
  }

  static async getDeletedTransactions(userId, since = null) {
    if (!db) throw new Error('Database not initialized');

    let query = `SELECT * FROM transactions WHERE userId = ? AND isDeleted = 1`;
    const params = [userId];

    if (since) {
      query += ` AND updatedAt > ?`;
      params.push(since);
    }

    query += ` ORDER BY updatedAt DESC`;

    const rows = await db.all(query, params);
    return rows.map(row => new Transaction(row));
  }

  // ============ ЗАКРЫТИЕ ============

  static async close() {
    if (db) {
      await db.close();
      db = null;
    }
  }
}

export default DatabaseService;
