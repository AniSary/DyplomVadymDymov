// src/routes/analytics.routes.js
// API endpoints для аналитики и прогнозирования

import express from 'express';
import DatabaseService from '../services/DatabaseService.js';
import AnalyticsEngine from '../services/AnalyticsEngine.js';
import { validatePeriod, validateUserId as validateUserIdFunc } from '../middleware/validation.js';

const router = express.Router();

// Middleware для проверки userId
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
 * GET /api/analytics/summary?period=month
 * Получить сводную статистику за период
 */
router.get('/summary', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Валидируем период
    const validPeriod = validatePeriod(period);
    
    const transactions = await DatabaseService.getTransactions(req.userId);
    
    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        data: {
          period: validPeriod,
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          transactionCount: 0
        }
      });
    }
    
    const stats = AnalyticsEngine.calculatePeriodStats(transactions, validPeriod);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Summary analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Error calculating summary statistics'
      }
    });
  }
});

/**
 * GET /api/analytics/trends
 * Получить тренды расходов
 */
router.get('/trends', async (req, res) => {
  try {
    const transactions = await DatabaseService.getTransactions(req.userId);
    
    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        data: {
          monthlyTrends: [],
          categoryTrends: []
        }
      });
    }
    
    const trends = AnalyticsEngine.calculateTrends(transactions);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Trends analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Error calculating trends'
      }
    });
  }
});

/**
 * GET /api/analytics/forecast
 * Предсказание расходов на следующий месяц
 */
router.get('/forecast', async (req, res) => {
  try {
    const transactions = await DatabaseService.getTransactions(req.userId);
    
    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        data: {
          predictedExpenses: 0,
          confidence: 0,
          basedOnMonths: 0
        }
      });
    }
    
    const forecast = AnalyticsEngine.predictNextMonthExpenses(transactions);

    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    console.error('Forecast analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Error generating forecast'
      }
    });
  }
});

/**
 * GET /api/analytics/recommendations
 * Получить рекомендации по сбережениям
 */
router.get('/recommendations', async (req, res) => {
  try {
    const transactions = await DatabaseService.getTransactions(req.userId);
    
    if (!transactions || transactions.length === 0) {
      return res.json({
        success: true,
        data: {
          recommendations: [],
          savingsPotential: 0
        }
      });
    }
    
    const recommendations = AnalyticsEngine.generateSavingsRecommendations(transactions);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Error generating recommendations'
      }
    });
  }
});
});

/**
 * GET /api/analytics/comparison
 * Сравнение разных периодов
 */
router.get('/comparison', async (req, res) => {
  try {
    const { period1 = 'month', period2 = 'year' } = req.query;
    const transactions = await DatabaseService.getTransactions(req.userId);

    const stats1 = AnalyticsEngine.calculatePeriodStats(transactions, period1);
    const stats2 = AnalyticsEngine.calculatePeriodStats(transactions, period2);

    res.json({
      success: true,
      data: {
        comparison: {
          period1: stats1,
          period2: stats2,
          changePercent: stats2.totalExpense > 0 
            ? ((stats1.totalExpense - stats2.totalExpense) / stats2.totalExpense) * 100
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Comparison analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Error performing comparison analysis'
      }
    });
  }
});

/**
 * GET /api/analytics/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'analytics-api',
    version: '2.0.0'
  });
});

export default router;
