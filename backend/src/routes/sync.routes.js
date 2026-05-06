// src/routes/sync.routes.js
// API endpoints для синхронизации данных между клиентом и сервером

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import DatabaseService from '../services/DatabaseService.js';
import SyncEngine from '../services/SyncEngine.js';
import { validateTransaction, validateUserId as validateUserIdFunc, APIError } from '../middleware/validation.js';

const router = express.Router();
const syncEngine = new SyncEngine('last-write-wins');

// Middleware для проверки userId (в реальном приложении здесь была бы аутентификация)
const validateUserIdMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!validateUserIdFunc(userId)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_USER_ID',
        message: 'Missing or invalid userId header'
      }
    });
  }
  req.userId = userId;
  next();
};

router.use(validateUserIdMiddleware);

/**
 * POST /api/sync/push
 * Клиент отправляет новые/измененные транзакции на сервер
 */
router.post('/push', async (req, res) => {
  try {
    const { transactions, deviceId, lastSyncTime } = req.body;

    // Валидация входных данных
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'transactions must be an array'
        }
      });
    }

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'deviceId is required'
        }
      });
    }

    const results = {
      uploaded: [],
      conflicts: [],
      errors: []
    };

    for (const tx of transactions) {
      try {
        // Валидируем каждую транзакцию
        const validation = validateTransaction(tx);
        if (!validation.isValid) {
          results.errors.push({
            transactionId: tx.id,
            code: 'VALIDATION_ERROR',
            errors: validation.errors
          });
          continue;
        }

        const existingTx = await DatabaseService.getTransaction(req.userId, tx.id);

        if (existingTx) {
          // Транзакция существует - проверяем версию
          if (tx.version > existingTx.version || 
              (tx.version === existingTx.version && new Date(tx.updatedAt) > new Date(existingTx.updatedAt))) {
            
            // Клиентская версия новее - обновляем
            const updated = await DatabaseService.updateTransaction(req.userId, tx.id, {
              amount: tx.amount,
              type: tx.type,
              category: tx.category,
              description: tx.description,
              date: tx.date,
              version: tx.version + 1,
              deviceId
            });
            results.uploaded.push(updated.toJSON());
          } else {
            // Сервер имеет более свежую версию - конфликт
            results.conflicts.push({
              id: tx.id,
              code: 'VERSION_CONFLICT',
              serverVersion: existingTx.toJSON(),
              clientVersion: tx
            });
          }
        } else {
          // Новая транзакция
          const newTx = await DatabaseService.createTransaction(req.userId, {
            id: tx.id || uuidv4(),
            ...tx,
            deviceId
          });
          results.uploaded.push(newTx.toJSON());
        }
      } catch (err) {
        results.errors.push({
          transactionId: tx.id,
          code: 'PROCESSING_ERROR',
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Push sync error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error during push sync'
      }
    });
  }
});

/**
 * POST /api/sync/pull
 * Клиент запрашивает новые/измененные транзакции с сервера
 */
router.post('/pull', async (req, res) => {
  try {
    const { lastSyncTime, deviceId } = req.body;

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'deviceId is required'
        }
      });
    }

    // Получаем все транзакции
    const allTransactions = await DatabaseService.getTransactions(req.userId);
    const deletedTransactions = await DatabaseService.getDeletedTransactions(req.userId, lastSyncTime);

    // Фильтруем только измененные после lastSyncTime
    let changedTransactions = allTransactions;
    if (lastSyncTime) {
      const lastSync = new Date(lastSyncTime);
      if (isNaN(lastSync.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'lastSyncTime must be a valid ISO date'
          }
        });
      }
      changedTransactions = allTransactions.filter(t => 
        new Date(t.updatedAt) > lastSync
      );
    }

    const syncLog = await DatabaseService.getSyncLog(req.userId, lastSyncTime);

    res.json({
      success: true,
      data: {
        transactions: changedTransactions.map(t => t.toJSON()),
        deletedTransactions: deletedTransactions.map(t => ({
          id: t.id,
          version: t.version,
          updatedAt: t.updatedAt
        })),
        syncLog: syncLog
      },
      serverTime: new Date().toISOString(),
      checksum: syncEngine.calculateChecksum(changedTransactions)
    });
  } catch (error) {
    console.error('Pull sync error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error during pull sync'
      }
    });
  }
});

/**
 * POST /api/sync/merge
 * Сервер помогает клиенту разрешить конфликты (полный merge)
 */
router.post('/merge', async (req, res) => {
  try {
    const { localTransactions, lastSyncTime, deviceId } = req.body;

    if (!Array.isArray(localTransactions)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'localTransactions must be an array'
        }
      });
    }

    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'deviceId is required'
        }
      });
    }

    // Получаем удаленные транзакции с сервера
    const serverTransactions = await DatabaseService.getTransactions(req.userId);
    const deletedTransactions = await DatabaseService.getDeletedTransactions(req.userId, lastSyncTime);

    // Используем SyncEngine для разрешения конфликтов
    const operations = syncEngine.mergeChanges(
      localTransactions,
      serverTransactions,
      deletedTransactions
    );

    // Применяем операции
    const results = {
      applied: [],
      conflicts: [],
      errors: []
    };

    for (const op of operations) {
      try {
        let result;
        switch (op.type) {
          case 'UPLOAD':
            result = await DatabaseService.createTransaction(req.userId, {
              ...op.data,
              deviceId
            });
            results.applied.push({ type: 'UPLOAD', transaction: result.toJSON() });
            break;

          case 'DOWNLOAD':
            results.applied.push({ type: 'DOWNLOAD', transaction: op.data.toJSON() });
            break;

          case 'DELETE':
            await DatabaseService.deleteTransaction(req.userId, op.id);
            results.applied.push({ type: 'DELETE', id: op.id });
            break;

          case 'SYNC_UPDATE':
            if (op.conflictResolved) {
              results.conflicts.push({
                id: op.id,
                resolution: {
                  winnerVersion: op.data.version,
                  reason: op.conflictReason,
                  loser: op.loserData.toJSON()
                }
              });
            }
            results.applied.push({ type: 'SYNC_UPDATE', transaction: op.data.toJSON() });
            break;
        }
      } catch (err) {
        results.errors.push({
          operationId: op.id,
          code: 'PROCESSING_ERROR',
          error: err.message
        });
      }
    }

    const stats = syncEngine.getMergeStats(operations);

    res.json({
      success: true,
      data: {
        results,
        stats
      },
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error during merge'
      }
    });
  }
});

/**
 * GET /api/sync/status
 * Получить статус синхронизации для пользователя
 */
router.get('/status', async (req, res) => {
  try {
    const transactions = await DatabaseService.getTransactions(req.userId);
    const syncLog = await DatabaseService.getSyncLog(req.userId);

    res.json({
      success: true,
      data: {
        totalTransactions: transactions.length,
        lastSyncChanges: syncLog.length,
        lastSyncLog: syncLog.slice(-10),
        serverTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sync/health
 * Health check endpoint для проверки доступности API
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'sync-api',
    version: '2.0.0'
  });
});

export default router;
