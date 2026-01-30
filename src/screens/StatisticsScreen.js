/**
 * Ekran statystyk - przychody i wydatki
 * Wykresy i analiza według kategorii
 */

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, EmptyState } from '../components';
import { formatCurrency } from '../utils/moneyUtils';
import { getMonthYear } from '../utils/dateUtils';

const StatisticsScreen = ({ navigation }) => {
  const {
    transactions,
    categories,
    settings,
    getMonthlyExpenses,
    getMonthlyIncome,
    getExpensesByCategory,
    getIncomeByCategory,
    theme,
    t,
  } = useApp();

  const styles = makeStyles(theme);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [expenseData, setExpenseData] = useState({});
  const [incomeData, setIncomeData] = useState({});

  // Aktualizuj dane, gdy ekran jest aktywny
  useFocusEffect(
    useCallback(() => {
      const expenses = getExpensesByCategory(selectedMonth);
      const incomes = getIncomeByCategory(selectedMonth);
      setExpenseData(expenses);
      setIncomeData(incomes);
    }, [selectedMonth, getExpensesByCategory, getIncomeByCategory])
  );

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncome = getMonthlyIncome();
  const currency = settings.currency || 'USD';

  // Sortuj kategorie według sumy
  const topExpenses = Object.entries(expenseData)
    .map(([categoryId, amount]) => ({
      category: categories.find(c => c.id === categoryId),
      amount,
      percentage: monthlyExpenses ? (amount / monthlyExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topIncomes = Object.entries(incomeData)
    .map(([categoryId, amount]) => ({
      category: categories.find(c => c.id === categoryId),
      amount,
      percentage: monthlyIncome ? (amount / monthlyIncome) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const ProgressBar = ({ percentage }) => (
    <View style={styles.progressBarContainer}>
      <View
        style={[
          styles.progressBar,
          { width: `${Math.min(percentage, 100)}%` },
        ]}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t('Statistics') || 'Statistics'}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Nawigacja miesięczna */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={handlePreviousMonth} style={[styles.navButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.navButtonText, { color: theme.primary }]}>{'← ' + (t('Prev') || 'Prev')}</Text>
          </TouchableOpacity>
          
          <Text style={[styles.monthText, { color: theme.text }]}>{getMonthYear(selectedMonth, settings.language)}</Text>
          
          <TouchableOpacity onPress={handleNextMonth} style={[styles.navButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.navButtonText, { color: theme.primary }]}>{(t('Next') || 'Next') + ' →'}</Text>
          </TouchableOpacity>
        </View>

        {/* Основные статистические карточки */}
        <Card
          title={t('Income (month)') || 'Income'}
          value={formatCurrency(monthlyIncome, currency)}
          color={theme.income}
        />

        <Card
          title={t('Expenses (month)') || 'Expenses'}
          value={formatCurrency(monthlyExpenses, currency)}
          color={theme.expense}
        />

        <Card
          title={t('Net Profit') || 'Net Profit'}
          value={formatCurrency(monthlyIncome - monthlyExpenses, currency)}
          subtitle={
            monthlyIncome - monthlyExpenses >= 0
              ? (t('You are in profit') || 'You are in profit')
              : (t('You are in loss') || 'You are in loss')
          }
          color={
            monthlyIncome - monthlyExpenses >= 0
              ? theme.success
              : theme.error
          }
        />

        {/* Расходы по категориям */}
        {topExpenses.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {`${t('Top Expenses')} (${topExpenses.length})`}
              </Text>
            </View>

            {topExpenses.map(({ category, amount, percentage }, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{category?.icon}</Text>
                  <View style={styles.categoryTexts}>
                    <Text style={styles.categoryName}>{category?.name}</Text>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(amount, currency)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>

                <ProgressBar percentage={percentage} />
              </View>
            ))}
          </>
        ) : (
          <EmptyState
            icon="📉"
            title={t('No Expenses') || 'No Expenses'}
            description={t('No expenses this month') || 'No expenses this month'}
          />
        )}

        {/* Доходы по категориям */}
        {topIncomes.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {`${t('Income by category')} (${topIncomes.length})`}
              </Text>
            </View>

            {topIncomes.map(({ category, amount, percentage }, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryIcon}>{category?.icon}</Text>
                  <View style={styles.categoryTexts}>
                    <Text style={styles.categoryName}>{category?.name}</Text>
                    <Text style={styles.categoryAmount}>
                      {formatCurrency(amount, currency)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>

                <ProgressBar percentage={percentage} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      flex: 1,
      paddingVertical: 8,
    },
    monthNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    navButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    navButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.primary,
    },
    monthText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    sectionHeader: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
      marginTop: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    categoryRow: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    categoryTexts: {
      flex: 1,
    },
    categoryName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    categoryAmount: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    percentage: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primary,
      textAlign: 'right',
      marginBottom: 8,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.surface,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.primary,
    },
  });

export default StatisticsScreen;
