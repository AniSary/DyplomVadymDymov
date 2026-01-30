/**
 * Компонент граничного заголовка
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';

export const SectionHeader = ({ title, action, style }) => {
  const { theme } = useApp();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {action && <Text style={styles.action}>{action}</Text>}
    </View>
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
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
    },
    action: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
    },
  });
