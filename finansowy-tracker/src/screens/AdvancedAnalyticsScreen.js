// src/screens/AdvancedAnalyticsScreen.js
// Экран продвинутой аналитики с прогнозированием и рекомендациями

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useApp } from '../context/AppContext';
import { isThisMonth } from '../utils/dateUtils';

export default function AdvancedAnalyticsScreen() {
  const context = useApp();
  const [refreshing, setRefreshing] = useState(false);

  // Безопасная работа с контекстом
  if (!context || !context.theme) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </SafeAreaView>
    );
  }

  const { theme, transactions = [], t } = context;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Вычисляем статистику
  const analytics = useMemo(() => {
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    
    const thisMonthTx = transactions.filter(t => {
      try {
        return isThisMonth(t.date);
      } catch {
        return false;
      }
    });
    
    const lastMonthTx = transactions.filter(t => {
      try {
        const d = new Date(t.date);
        return d.getFullYear() === lastMonth.getFullYear() && 
               d.getMonth() === lastMonth.getMonth();
      } catch {
        return false;
      }
    });

    const totalIncome = thisMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    const totalExpense = thisMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    const lastMonthExpense = lastMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    const changePercent = lastMonthExpense > 0 
      ? ((totalExpense - lastMonthExpense) / lastMonthExpense) * 100 
      : 0;

    return {
      totalIncome: isNaN(totalIncome) ? 0 : totalIncome,
      totalExpense: isNaN(totalExpense) ? 0 : totalExpense,
      balance: isNaN(totalIncome - totalExpense) ? 0 : totalIncome - totalExpense,
      changePercent: isNaN(changePercent) ? 0 : Math.round(changePercent * 10) / 10,
    };
  }, [transactions]);

  const styles = makeStyles(theme);

  // Получаем рекомендацию на основе трендов
  const getRecommendation = () => {
    if (analytics.changePercent > 10) {
      return t('Expenses growing!') || 'Расходы растут! Пересмотрите бюджет';
    } else if (analytics.changePercent < -10) {
      return t('Good savings!') || 'Хорошая экономия!';
    } else {
      return t('Expenses are stable') || 'Расходы стабильны';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 {t('Analytics') || 'Аналитика'}</Text>
        </View>

        {/* Основные цифры */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Monthly Summary') || 'Сводка за месяц'}</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('Income') || 'Доход'}</Text>
              <Text style={[styles.statValue, { color: '#27AE60' }]}>
                +{analytics.totalIncome.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('Expenses') || 'Расход'}</Text>
              <Text style={[styles.statValue, { color: '#E74C3C' }]}>
                -{analytics.totalExpense.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('Balance') || 'Баланс'}</Text>
              <Text style={[
                styles.statValue, 
                { color: analytics.balance >= 0 ? '#27AE60' : '#E74C3C' }
              ]}>
                {analytics.balance > 0 ? '+' : ''}{analytics.balance.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Тренды */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Expense Trends') || 'Тренды расходов'}</Text>
          
          <View style={styles.trendBox}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendLabel}>{t('Change') || 'Изменение:'}</Text>
              <Text style={[
                styles.trendValue,
                { color: analytics.changePercent < 0 ? '#27AE60' : '#E74C3C' }
              ]}>
                {analytics.changePercent > 0 ? '+' : ''}{analytics.changePercent.toFixed(1)}%
              </Text>
            </View>
            <Text style={styles.recommendation}>
              💡 {getRecommendation()}
            </Text>
          </View>
        </View>

        {/* Прогноз */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Forecast for next month') || 'Прогноз на следующий месяц'}</Text>
          
          <View style={styles.forecastBox}>
            <Text style={styles.forecastLabel}>{t('Estimated expenses') || 'Предполагаемые расходы:'}</Text>
            <Text style={styles.forecastValue}>
              {analytics.totalExpense.toFixed(2)}
            </Text>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, { width: '70%' }]} />
            </View>
            <Text style={styles.confidenceText}>
              {t('Confidence') || 'Уверенность:'} 70%
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.surface || theme.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statLabel: {
    fontSize: 11,
    color: theme.textSecondary || theme.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  trendBox: {
    backgroundColor: theme.surface || theme.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  recommendation: {
    fontSize: 13,
    color: theme.text,
    marginTop: 8,
    lineHeight: 18,
  },
  forecastBox: {
    backgroundColor: theme.surface || theme.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  forecastLabel: {
    fontSize: 12,
    color: theme.textSecondary || theme.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  forecastValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 12,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: theme.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 11,
    color: theme.textSecondary || theme.text,
  },
});
