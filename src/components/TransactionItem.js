/**
 * Komponent elementu listy transakcji
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { formatDate, formatTime } from '../utils/dateUtils';
import { formatCurrency } from '../utils/moneyUtils';

export const TransactionItem = ({
  transaction,
  category,
  currency,
  onPress,
  onLongPress,
}) => {
  const { theme, t } = useApp();
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.income : theme.expense;
  const amountPrefix = isIncome ? '+' : '-';

  const styles = makeStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{category?.icon || '📌'}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.category} numberOfLines={1}>
            {(category && category.nameKey && t(category.nameKey)) || category?.name || t('Unknown Category')}
          </Text>
          <Text style={styles.date}>
            {formatDate(transaction.date)} {formatTime(transaction.date)}
          </Text>
          {transaction.comment && (
            <Text style={styles.comment} numberOfLines={1}>
              {transaction.comment}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }] }>
          {amountPrefix} {formatCurrency(transaction.amount, currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    icon: {
      fontSize: 24,
    },
    info: {
      flex: 1,
    },
    category: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    date: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    comment: {
      fontSize: 12,
      color: theme.textSecondary,
      fontStyle: 'italic',
    },
    amountContainer: {
      marginLeft: 12,
    },
    amount: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
