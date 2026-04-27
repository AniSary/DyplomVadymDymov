// src/services/AnalyticsEngine.js
// Продвинутая аналитика с прогнозированием и рекомендациями

export class AnalyticsEngine {
  /**
   * Получить основную статистику за период
   */
  static calculatePeriodStats(transactions, period = 'month') {
    const now = new Date();
    let startDate = new Date();

    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    }

    const filtered = transactions.filter(t => new Date(t.date) >= startDate);

    const stats = {
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: filtered.length,
      avgTransaction: 0,
      byCategory: {}
    };

    for (const tx of filtered) {
      if (tx.type === 'income') {
        stats.totalIncome += tx.amount;
      } else {
        stats.totalExpense += tx.amount;
      }

      // Группировка по категориям
      if (!stats.byCategory[tx.category]) {
        stats.byCategory[tx.category] = { amount: 0, count: 0, type: tx.type };
      }
      stats.byCategory[tx.category].amount += tx.amount;
      stats.byCategory[tx.category].count++;
    }

    stats.balance = stats.totalIncome - stats.totalExpense;
    stats.avgTransaction = filtered.length > 0 ? stats.balance / filtered.length : 0;

    return stats;
  }

  /**
   * Рассчитать тренды по категориям (простой анализ тренда)
   * Возвращает процент изменения месяц-к-месяцу
   */
  static calculateTrends(transactions) {
    const now = new Date();
    const currentMonth = this.getMonthData(transactions, now);
    
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthData = this.getMonthData(transactions, lastMonth);

    const trends = {
      currentMonth: currentMonth.totalExpense,
      lastMonth: lastMonthData.totalExpense,
      changePercent: 0,
      trending: {},
      recommendation: ''
    };

    // Расчет процента изменения
    if (lastMonthData.totalExpense > 0) {
      trends.changePercent = 
        ((currentMonth.totalExpense - lastMonthData.totalExpense) / lastMonthData.totalExpense) * 100;
    }

    // Тренды по категориям
    for (const category of Object.keys(currentMonth.byCategory)) {
      const current = currentMonth.byCategory[category]?.amount || 0;
      const last = lastMonthData.byCategory[category]?.amount || 0;

      let changePercent = 0;
      if (last > 0) {
        changePercent = ((current - last) / last) * 100;
      }

      trends.trending[category] = {
        current,
        last,
        changePercent
      };
    }

    // Рекомендация на основе тренда
    if (trends.changePercent > 10) {
      trends.recommendation = `Расходы выросли на ${trends.changePercent.toFixed(1)}% - обратите внимание на категории: ${this.getHighestIncreaseCategories(trends.trending, 2).join(', ')}`;
    } else if (trends.changePercent < -10) {
      trends.recommendation = `Хорошо! Расходы снизились на ${Math.abs(trends.changePercent).toFixed(1)}%`;
    } else {
      trends.recommendation = `Расходы стабильны`;
    }

    return trends;
  }

  /**
   * Предсказать расходы на следующий месяц (простой метод усреднения)
   */
  static predictNextMonthExpenses(transactions) {
    const months = {};
    
    // Группируем транзакции по месяцам
    for (const tx of transactions) {
      if (tx.type === 'expense') {
        const date = new Date(tx.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!months[monthKey]) {
          months[monthKey] = 0;
        }
        months[monthKey] += tx.amount;
      }
    }

    const monthValues = Object.values(months);
    if (monthValues.length === 0) {
      return { predictedAmount: 0, confidence: 0, method: 'no-data' };
    }

    // Средний расход
    const average = monthValues.reduce((a, b) => a + b, 0) / monthValues.length;

    // Стандартное отклонение (для оценки уверенности)
    const variance = monthValues.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / monthValues.length;
    const stdDev = Math.sqrt(variance);

    // Уверенность: чем меньше стандартное отклонение, тем больше уверенность
    let confidence = 100 - Math.min((stdDev / average) * 100, 100);
    if (monthValues.length < 3) confidence *= 0.7; // Штраф за мало данных

    return {
      predictedAmount: Math.round(average * 100) / 100,
      confidence: Math.max(0, Math.round(confidence)),
      method: 'simple-average',
      monthsAnalyzed: monthValues.length,
      minMonth: Math.min(...monthValues),
      maxMonth: Math.max(...monthValues)
    };
  }

  /**
   * Анализ привычек расходов и рекомендации по экономии
   */
  static generateSavingsRecommendations(transactions) {
    const stats = this.calculatePeriodStats(transactions, 'month');
    const recommendations = [];

    // Сортируем категории по сумме
    const categories = Object.entries(stats.byCategory)
      .filter(([_, data]) => data.type === 'expense')
      .sort((a, b) => b[1].amount - a[1].amount);

    // Рекомендация 1: Найти самую дорогую категорию
    if (categories.length > 0) {
      const [topCategory, topData] = categories[0];
      const percentage = (topData.amount / stats.totalExpense) * 100;

      recommendations.push({
        priority: 'high',
        category: topCategory,
        amount: topData.amount,
        percentage,
        message: `"${topCategory}" занимает ${percentage.toFixed(1)}% ваших расходов. Сможете ли вы сократить это на 10%?`,
        savings: Math.round(topData.amount * 0.1 * 100) / 100
      });
    }

    // Рекомендация 2: Частые малые расходы
    const smallTransactions = transactions
      .filter(t => t.type === 'expense' && t.amount < (stats.totalExpense / stats.transactionCount) * 0.8)
      .slice(0, 5);

    if (smallTransactions.length > 0) {
      const smallTotal = smallTransactions.reduce((sum, t) => sum + t.amount, 0);
      recommendations.push({
        priority: 'medium',
        message: `У вас много мелких расходов (${smallTransactions.length} за последний месяц). Их сумма: ${Math.round(smallTotal * 100) / 100}`,
        savings: Math.round(smallTotal * 0.15 * 100) / 100
      });
    }

    // Рекомендация 3: Нестабильные категории
    if (categories.length > 1) {
      const variation = this.calculateCategoryVariation(transactions, categories[0][0]);
      if (variation > 30) {
        recommendations.push({
          priority: 'medium',
          category: categories[0][0],
          message: `Расходы в "${categories[0][0]}" очень нестабильны (вариация ${variation.toFixed(1)}%). Попробуйте установить бюджет.`,
          savings: 0
        });
      }
    }

    return recommendations;
  }

  /**
   * Получить данные по месяцам (вспомогательная функция)
   */
  static getMonthData(transactions, dateInMonth) {
    const year = dateInMonth.getFullYear();
    const month = dateInMonth.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const filtered = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate >= startDate && txDate <= endDate;
    });

    const stats = {
      totalIncome: 0,
      totalExpense: 0,
      byCategory: {}
    };

    for (const tx of filtered) {
      if (tx.type === 'income') {
        stats.totalIncome += tx.amount;
      } else {
        stats.totalExpense += tx.amount;
      }

      if (!stats.byCategory[tx.category]) {
        stats.byCategory[tx.category] = { amount: 0, type: tx.type };
      }
      stats.byCategory[tx.category].amount += tx.amount;
    }

    return stats;
  }

  /**
   * Вычислить вероятность того что еще будут расходы на эту категорию
   */
  static calculateCategoryVariation(transactions, category) {
    const categoryTx = transactions.filter(t => t.category === category && t.type === 'expense');
    
    if (categoryTx.length < 2) return 0;

    // Считаем дни между транзакциями
    const dates = categoryTx.map(t => new Date(t.date).getTime()).sort((a, b) => a - b);
    const intervals = [];

    for (let i = 1; i < dates.length; i++) {
      intervals.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24)); // дни
    }

    if (intervals.length === 0) return 0;

    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    return (stdDev / avg) * 100;
  }

  /**
   * Помощник для получения категорий с наибольшим увеличением
   */
  static getHighestIncreaseCategories(trending, count) {
    return Object.entries(trending)
      .filter(([_, data]) => data.changePercent > 5)
      .sort((a, b) => b[1].changePercent - a[1].changePercent)
      .slice(0, count)
      .map(([category, _]) => category);
  }
}

export default AnalyticsEngine;
