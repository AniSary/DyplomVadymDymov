/**
 * Ekran Transakcji - lista wszystkich operacji
 * Z filtrowaniem po typie i możliwością edycji/usuwania
 */

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { TransactionItem, EmptyState, Button } from '../components';
import { formatDate } from '../utils/dateUtils';

const TransactionsScreen = ({ navigation }) => {
  const {
    transactions,
    categories,
    settings,
    deleteTransaction,
    t,
    theme,
  } = useApp();

  const styles = makeStyles(theme);

  const [filter, setFilter] = useState('all');
  const [sortedTransactions, setSortedTransactions] = useState([]);

  // Aktualizujemy listę przy fokusie ekranu
  useFocusEffect(
    useCallback(() => {
      const filtered = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter);

      const sorted = [...filtered].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Grupujemy po datach
      const grouped = {};
      sorted.forEach(transaction => {
        const dateKey = formatDate(transaction.date);
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(transaction);
      });

      setSortedTransactions(grouped);
    }, [transactions, filter])
  );

  const handleDelete = (transactionId) => {
    Alert.alert(
      t('Delete Transaction') || 'Usuń operację?',
      t('This action cannot be undone') || 'Tej operacji nie można cofnąć',
      [
        { text: t('Cancel') || 'Anuluj', onPress: () => {} },
        {
          text: t('Delete') || 'Usuń',
          onPress: () => deleteTransaction(transactionId),
          style: 'destructive',
        },
      ]
    );
  };

  const handleEdit = (transaction) => {
    navigation.navigate('AddTransaction', { transaction });
  };

  const renderTransactionGroup = ({ item: dateKey }) => {
    const transactionsForDate = sortedTransactions[dateKey];
    
    return (
      <View key={dateKey}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{dateKey}</Text>
        </View>
        
        {transactionsForDate.map(transaction => {
          const category = categories.find(c => c.id === transaction.categoryId);
          
          return (
            <TouchableOpacity
              key={transaction.id}
              onPress={() => handleEdit(transaction)}
              onLongPress={() => handleDelete(transaction.id)}
              delayLongPress={500}
            >
              <TransactionItem
                transaction={transaction}
                category={category}
                currency={settings.currency}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const dateKeys = Object.keys(sortedTransactions);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Transactions') || 'Transactions'}</Text>
      </View>

      {/* Filtry */}
      <View style={styles.filterContainer}>
        {['all', 'expense', 'income'].map(filterType => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[
                styles.filterText,
                filter === filterType && styles.filterTextActive,
              ]}
            >
                {filterType === 'all'
                ? t('All')
                : filterType === 'income'
                ? t('Income')
                : t('Expenses')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista transakcji */}
      {dateKeys.length > 0 ? (
        <FlatList
          data={dateKeys}
          renderItem={renderTransactionGroup}
          keyExtractor={item => item}
          scrollEnabled={false}
          ListContainerComponent={View}
        />
      ) : (
        <EmptyState
          icon="📭"
          title={t('No Transactions')}
          description={
            filter === 'all'
              ? t('No Transactions')
              : filter === 'income'
              ? t('No income')
              : t('No expenses')
          }
          buttonText={t('Add Transaction')}
          onButtonPress={() => navigation.navigate('AddTransaction')}
        />
      )}

      {/* Przycisk dodawania */}
      <View style={styles.footer}>
        <Button
          title={t('Add Transaction') || '+ Dodaj operację'}
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
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.text,
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    dateHeader: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
    },
    dateText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
  });

export default TransactionsScreen;
