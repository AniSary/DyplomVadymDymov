// src/models/Transaction.js
// Модель транзакции с поддержкой версионирования для синхронизации

export class Transaction {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.amount = data.amount || 0;
    this.type = data.type || 'expense'; // 'income' или 'expense'
    this.category = data.category || '';
    this.description = data.description || '';
    this.date = data.date || new Date().toISOString();
    
    // Metadata для синхронизации
    this.version = data.version || 1; // Версия для отслеживания изменений
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.deviceId = data.deviceId || null; // Какое устройство создало/изменило
    this.isDeleted = data.isDeleted || false; // Soft delete для синхронизации
  }

  // Эта транзакция новее чем другая?
  isNewerThan(other) {
    if (!other) return true;
    if (this.version !== other.version) {
      return this.version > other.version;
    }
    // Если версии одинаковые, сравниваем по времени (Last-Write-Wins)
    return new Date(this.updatedAt) > new Date(other.updatedAt);
  }

  // Увеличить версию (для локальных изменений)
  incrementVersion() {
    this.version++;
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      category: this.category,
      description: this.description,
      date: this.date,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deviceId: this.deviceId,
      isDeleted: this.isDeleted
    };
  }
}

export default Transaction;
