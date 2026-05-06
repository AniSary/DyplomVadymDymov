/**
 * Middleware для валидации данных
 * Проверяет входящие данные перед обработкой
 */

/**
 * Валидирует транзакцию перед сохранением
 */
export const validateTransaction = (transaction) => {
  const errors = [];

  // Проверка обязательных полей
  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('type must be "income" or "expense"');
  }

  // Проверка суммы
  if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
    errors.push('amount must be a positive number');
  }

  if (transaction.amount > 1000000) {
    errors.push('amount is too large (max 1,000,000)');
  }

  // Проверка категории
  if (!transaction.category || typeof transaction.category !== 'string') {
    errors.push('category is required and must be a string');
  }

  if (transaction.category.length > 50) {
    errors.push('category must be less than 50 characters');
  }

  // Проверка даты
  if (!transaction.date) {
    errors.push('date is required');
  } else {
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      errors.push('date must be a valid ISO date string');
    }
    if (date > new Date()) {
      errors.push('date cannot be in the future');
    }
  }

  // Проверка комментария
  if (transaction.description && transaction.description.length > 500) {
    errors.push('description must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Валидирует userId
 */
export const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  if (userId.length > 100) {
    return false;
  }
  return true;
};

/**
 * Валидирует период для аналитики
 */
export const validatePeriod = (period) => {
  const validPeriods = ['week', 'month', 'quarter', 'year', 'all'];
  return validPeriods.includes(period) ? period : 'month';
};

/**
 * Стандартизированный формат ошибок API
 */
export class APIError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details })
      }
    };
  }
}

/**
 * Middleware для обработки ошибок
 */
export const errorHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
};
