// src/routes/sync.routes.js
// API endpoints для синхронизации данных между клиентом и сервером

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import DatabaseService from '../services/DatabaseService.js';
import SyncEngine from '../services/SyncEngine.js';

const router = express.Router();
const syncEngine = new SyncEngine('last-write-wins');

// Middleware для проверки userId (в реальном приложении здесь была бы аутентификация)
const validateUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Missing userId' });
  }
  req.userId = userId;
  next();
};

router.use(validateUserId);

/**
 * POST /api/sync/push
 * Клиент отправляет новые/измененные транзакции на сервер
 */
router.post('/push', async (req, res) => {
  try {
    const { transactions, deviceId, lastSyncTime } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Invalid transactions array' });
    }

    const results = {
      uploaded: [],
      conflicts: [],
      errors: []
    };

    for (const tx of transactions) {
      try {
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
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      results,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Push sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sync/pull
 * Клиент запрашивает новые/измененные транзакции с сервера
 */
router.post('/pull', async (req, res) => {
  try {
    const { lastSyncTime, deviceId } = req.body;

    // Получаем все транзакции (в реальном приложении нужна пагинация)
    const allTransactions = await DatabaseService.getTransactions(req.userId);
    const deletedTransactions = await DatabaseService.getDeletedTransactions(req.userId, lastSyncTime);

    // Фильтруем только измененные после lastSyncTime
    let changedTransactions = allTransactions;
    if (lastSyncTime) {
      changedTransactions = allTransactions.filter(t => 
        new Date(t.updatedAt) > new Date(lastSyncTime)
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sync/merge
 * Сервер помогает клиенту разрешить конфликты (полный merge)
 */
router.post('/merge', async (req, res) => {
  try {
    const { localTransactions, lastSyncTime, deviceId } = req.body;

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
      conflicts: []
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
        console.error('Error applying operation:', err);
      }
    }

    const stats = syncEngine.getMergeStats(operations);

    res.json({
      success: true,
      results,
      stats,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: error.message });
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

export default router;
