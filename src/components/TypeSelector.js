/**
 * Komponent do wyboru typu operacji (dochód/wydatek)
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';

export const TypeSelector = ({ selected, onSelect, style }) => {
  const { theme, t } = useApp();
  const types = [
    { value: 'expense', label: t('Expenses') || 'Expense', icon: '📉', color: theme.expense },
    { value: 'income', label: t('Income') || 'Income', icon: '📈', color: theme.income },
  ];

  const styles = makeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {types.map(type => (
        <TouchableOpacity
          key={type.value}
          style={[
            styles.button,
            selected === type.value && [
              styles.buttonSelected,
              { borderColor: type.color, backgroundColor: type.color },
            ],
          ]}
          onPress={() => onSelect(type.value)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{type.icon}</Text>
          <Text
            style={[
              styles.label,
              selected === type.value && styles.labelSelected,
            ]}
          >
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
      gap: 12,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    buttonSelected: {
      borderWidth: 2,
    },
    icon: {
      fontSize: 20,
      marginRight: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    labelSelected: {
      color: '#FFFFFF',
    },
  });
