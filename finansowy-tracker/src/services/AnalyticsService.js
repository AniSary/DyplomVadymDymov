// src/services/AnalyticsService.js
// Сервис для получения продвинутой аналитики с backend сервера

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://finansowy-tracker-production.up.railway.app/api';

export class AnalyticsService {
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Получить сводную статистику за период
   */
  async getSummary(period = 'month') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/summary?period=${period}`,
        {
          headers: { 'X-User-ID': this.userId }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get summary');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Summary error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить тренды расходов между месяцами
   */
  async getTrends() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/trends`,
        {
          headers: { 'X-User-ID': this.userId }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get trends');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Trends error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить прогноз расходов на следующий месяц
   */
  async getForecast() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/forecast`,
        {
          headers: { 'X-User-ID': this.userId }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get forecast');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Forecast error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить рекомендации по сбережениям
   */
  async getRecommendations() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/recommendations`,
        {
          headers: { 'X-User-ID': this.userId }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Recommendations error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Сравнить разные периоды
   */
  async getComparison(period1 = 'month', period2 = 'year') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/comparison?period1=${period1}&period2=${period2}`,
        {
          headers: { 'X-User-ID': this.userId }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get comparison');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Comparison error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получить все аналитические данные сразу
   */
  async getFullAnalytics() {
    try {
      const [summary, trends, forecast, recommendations] = await Promise.all([
        this.getSummary('month'),
        this.getTrends(),
        this.getForecast(),
        this.getRecommendations()
      ]);

      return {
        success: summary.success && trends.success && forecast.success && recommendations.success,
        data: {
          summary: summary.data,
          trends: trends.data,
          forecast: forecast.data,
          recommendations: recommendations.data
        }
      };
    } catch (error) {
      console.error('Full analytics error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default AnalyticsService;
