/**
 * Dashboard (Главный экран)
 * Отображает текущий баланс, расходы и краткую статистику
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, Button, SectionHeader, EmptyState, SafeText } from '../components';
import { formatCurrency } from '../utils/moneyUtils';
import { isThisMonth } from '../utils/dateUtils';

const DashboardScreen = ({ navigation }) => {
  const {
    transactions,
    categories,
    settings,
    getBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    getExpensesByCategory,
    t,
    tAutoTranslate,
    theme,
  } = useApp();

  const styles = makeStyles(theme);

  const [categoryStats, setCategoryStats] = useState({});

  // Обновляем статистику при загрузке и фокусе экрана
  useFocusEffect(
    useCallback(() => {
      const stats = getExpensesByCategory();
      setCategoryStats(stats);
    }, [getExpensesByCategory])
  );

  const balance = getBalance();
  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncome = getMonthlyIncome();
  const currency = settings.currency || 'USD';

  // Получаем топ 3 категории по расходам
  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([categoryId, amount]) => ({
      category: categories.find(c => c.id === categoryId),
      amount,
    }));

  // Последние 5 транзакций текущего месяца
  const recentTransactions = transactions
    .filter(t => isThisMonth(t.date))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getStatusColor = () => {
    if (balance >= monthlyIncome * 0.5) return theme.success;
    if (balance >= 0) return theme.warning;
    return theme.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SafeText style={styles.headerTitle}>{t('App Name')}</SafeText>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <SafeText style={styles.settingsIcon}>⚙️</SafeText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Основная информация */}
        <Card
          title={t('Current Balance')}
          value={formatCurrency(balance, currency)}
          subtitle={t('Your Account')}
          color={getStatusColor()}
        />

        {/* Статистика по доходам и расходам */}
        <View style={styles.statsRow}>
          <Card
            title={t('Income (month)')}
            value={formatCurrency(monthlyIncome, currency)}
            color={theme.income}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Card
            title={t('Expenses (month)')}
            value={formatCurrency(monthlyExpenses, currency)}
            color={theme.expense}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        {/* Топ категории */}
        {topCategories.length > 0 && (
          <>
            <SectionHeader
              title={t('Top Expenses')}
              action={`${t('Show All')}: ${formatCurrency(monthlyExpenses, currency)}`}
              style={styles.sectionHeader}
            />
            {topCategories.map(({ category, amount }, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <SafeText style={styles.categoryIcon}>{category?.icon}</SafeText>
                  <SafeText style={styles.categoryName}>
                    {category && (category.nameKey ? t(category.nameKey) : (category.name && tAutoTranslate(category.name, 'en')) || 'Unknown')}
                  </SafeText>
                </View>
                <SafeText style={styles.categoryAmount}>
                  {formatCurrency(amount, currency)}
                </SafeText>
              </View>
            ))}
          </>
        )}

        {/* Последние транзакции */}
        {recentTransactions.length > 0 ? (
          <>
            <SectionHeader
              title={t('Recent Transactions')}
              action={t('Show All')}
              onPress={() => navigation.navigate('Transactions')}
              style={styles.sectionHeader}
            />
            {recentTransactions.map(transaction => {
              const category = categories.find(c => c.id === transaction.categoryId);
              const categoryName = category
                ? (category.nameKey ? t(category.nameKey) : tAutoTranslate(category.name, 'en'))
                : t('Unknown');
              
              return (
                <View
                  key={transaction.id}
                  style={styles.transactionRow}
                >
                  <View style={styles.transactionLeft}>
                    <SafeText style={styles.transactionIcon}>
                      {category?.icon || '📌'}
                    </SafeText>
                    <View>
                      <SafeText style={styles.transactionCategory}>
                        {categoryName}
                      </SafeText>
                      {transaction.comment && (
                        <SafeText style={styles.transactionComment}>
                          {transaction.comment}
                        </SafeText>
                      )}
                    </View>
                  </View>
                  <SafeText
                    style={[
                      styles.transactionAmount,
                      {
                        color: transaction.type === 'income'
                          ? theme.income
                          : theme.expense,
                      },
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </SafeText>
                </View>
              );
            })}
          </>
        ) : (
          <EmptyState
            icon="📊"
            title={t('No Transactions')}
            description={t('No Transactions')}
            style={styles.emptyState}
          />
        )}
      </ScrollView>

      {/* Кнопка добавления операции */}
      <View style={styles.footer}>
        <Button
          title={t('Add Transaction')}
          onPress={() => navigation.navigate('AddTransaction')}
        />
      </View>
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    settingsIcon: {
      fontSize: 24,
    },
    content: {
      flex: 1,
      paddingVertical: 8,
    },
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: 0,
    },
    sectionHeader: {
      marginTop: 8,
    },
    categoryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    categoryName: {
      fontSize: 14,
      color: theme.text,
    },
    categoryAmount: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.error,
    },
    transactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    transactionIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    transactionCategory: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    transactionComment: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    emptyState: {
      marginVertical: 40,
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
  });

export default DashboardScreen;
