/**
 * Komponent do wyświetlania kategorii
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';

export const CategoryItem = ({
  category,
  total,
  currency,
  onPress,
  onDelete,
  showAmount = true,
  style,
}) => {
  const { theme, t } = useApp();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: category.color },
          ]}
        >
          <Text style={styles.icon}>{category.icon}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.type}>
            {category.type === 'income' ? t('Income') || 'Income' : t('Expense') || 'Expense'}
          </Text>
        </View>
      </View>

      {showAmount && total !== undefined && (
        <View style={styles.right}>
          <Text style={styles.amount}>
            {currency} {total.toFixed(2)}
          </Text>
        </View>
      )}

      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(category.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
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
    name: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    type: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    right: {
      alignItems: 'flex-end',
      marginLeft: 8,
    },
    amount: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.primary,
    },
    deleteButton: {
      padding: 8,
      marginLeft: 8,
    },
    deleteIcon: {
      fontSize: 20,
      color: theme.error,
      fontWeight: 'bold',
    },
  });
