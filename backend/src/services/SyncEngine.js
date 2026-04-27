// src/services/SyncEngine.js
// Механизм синхронизации с разрешением конфликтов
// Использует подход Last-Write-Wins + Version-based conflict detection

export class SyncEngine {
  constructor(conflictStrategy = 'last-write-wins') {
    this.conflictStrategy = conflictStrategy;
  }

  /**
   * Разрешить конфликт между локальной и удаленной версией
   * Возвращает выигравшую версию и информацию о конфликте
   */
  resolveConflict(localTransaction, remoteTransaction) {
    if (!localTransaction || !remoteTransaction) {
      return {
        winner: localTransaction || remoteTransaction,
        conflict: false,
        reason: 'one-missing'
      };
    }

    // Если версии одинаковые - то конфликта нет
    if (localTransaction.version === remoteTransaction.version && 
        localTransaction.updatedAt === remoteTransaction.updatedAt) {
      return {
        winner: localTransaction,
        conflict: false,
        reason: 'same-version'
      };
    }

    // Есть конфликт - у них разные версии или время обновления
    let winner;
    let loser;
    let conflictType;

    if (this.conflictStrategy === 'last-write-wins') {
      // Last-Write-Wins: кто обновлялся последнее время?
      const localTime = new Date(localTransaction.updatedAt).getTime();
      const remoteTime = new Date(remoteTransaction.updatedAt).getTime();

      if (localTime > remoteTime) {
        winner = localTransaction;
        loser = remoteTransaction;
        conflictType = 'local-newer';
      } else if (remoteTime > localTime) {
        winner = remoteTransaction;
        loser = localTransaction;
        conflictType = 'remote-newer';
      } else {
        // Если время одинаковое, берем с большей версией
        if (localTransaction.version >= remoteTransaction.version) {
          winner = localTransaction;
          loser = remoteTransaction;
          conflictType = 'same-time-local-version-higher';
        } else {
          winner = remoteTransaction;
          loser = localTransaction;
          conflictType = 'same-time-remote-version-higher';
        }
      }
    } else if (this.conflictStrategy === 'remote-always-wins') {
      winner = remoteTransaction;
      loser = localTransaction;
      conflictType = 'remote-always-wins';
    } else if (this.conflictStrategy === 'local-always-wins') {
      winner = localTransaction;
      loser = remoteTransaction;
      conflictType = 'local-always-wins';
    } else {
      throw new Error(`Unknown conflict strategy: ${this.conflictStrategy}`);
    }

    return {
      winner,
      loser,
      conflict: true,
      reason: conflictType
    };
  }

  /**
   * Слить (merge) локальные и удаленные изменения
   * Возвращает массив операций синхронизации
   */
  mergeChanges(localTransactions, remoteTransactions, deletedTransactions = []) {
    const operations = [];
    const merged = new Map();

    // Сначала добавляем все удаленные транзакции
    for (const remote of remoteTransactions) {
      merged.set(remote.id, { remote, local: null, operation: null });
    }

    // Теперь добавляем локальные тхазакции
    for (const local of localTransactions) {
      if (merged.has(local.id)) {
        const entry = merged.get(local.id);
        entry.local = local;
      } else {
        merged.set(local.id, { remote: null, local, operation: null });
      }
    }

    // Обрабатываем удаленные транзакции
    for (const deleted of deletedTransactions) {
      if (merged.has(deleted.id)) {
        merged.get(deleted.id).deleted = true;
      } else {
        merged.set(deleted.id, { remote: deleted, local: null, deleted: true });
      }
    }

    // Теперь определяем операции для каждой транзакции
    for (const [id, entry] of merged.entries()) {
      const { local, remote, deleted } = entry;

      if (deleted) {
        // Трансакция удалена на сервере
        operations.push({
          type: 'DELETE',
          id,
          localVersion: local?.version,
          remoteVersion: remote?.version || deleted.version
        });
      } else if (local && remote) {
        // Есть и локальная и удаленная версия - нужна синхронизация
        const resolution = this.resolveConflict(local, remote);
        
        if (!resolution.conflict) {
          // Конфликта нет - просто обновляем
          operations.push({
            type: 'SYNC_UPDATE',
            id,
            data: resolution.winner,
            conflictResolved: false
          });
        } else {
          // Конфликт! Берем выигравшую версию
          operations.push({
            type: 'SYNC_UPDATE',
            id,
            data: resolution.winner,
            conflictResolved: true,
            conflictReason: resolution.reason,
            loserData: resolution.loser
          });
        }
      } else if (local && !remote) {
        // Локальная транзакция, отправляем на сервер
        operations.push({
          type: 'UPLOAD',
          id,
          data: local
        });
      } else if (remote && !local) {
        // Удаленная транзакция, скачиваем на клиент
        operations.push({
          type: 'DOWNLOAD',
          id,
          data: remote
        });
      }
    }

    return operations;
  }

  /**
   * Поставить "checksum" данных для проверки целостности
   */
  calculateChecksum(transactions) {
    // Простой checksum: XOR всех ID и версий
    let checksum = 0;
    
    for (const tx of transactions) {
      for (let char of tx.id) {
        checksum ^= char.charCodeAt(0);
      }
      checksum ^= tx.version;
      checksum ^= Math.floor(tx.amount);
    }

    return checksum.toString(16);
  }

  /**
   * Получить статистику слияния
   */
  getMergeStats(operations) {
    const stats = {
      total: operations.length,
      uploads: 0,
      downloads: 0,
      conflicts: 0,
      deletes: 0,
      syncs: 0
    };

    for (const op of operations) {
      switch (op.type) {
        case 'UPLOAD': stats.uploads++; break;
        case 'DOWNLOAD': stats.downloads++; break;
        case 'DELETE': stats.deletes++; break;
        case 'SYNC_UPDATE': 
          stats.syncs++;
          if (op.conflictResolved) stats.conflicts++;
          break;
      }
    }

    return stats;
  }
}

export default SyncEngine;
