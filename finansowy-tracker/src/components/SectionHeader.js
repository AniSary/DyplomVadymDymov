/**
 * Компонент граничного заголовка - адаптивный
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getResponsiveFontSize, getResponsivePadding } from '../utils/responsiveUtils';
import { SafeText } from './SafeText';

export const SectionHeader = ({ title, action, style }) => {
  const { theme } = useApp();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <SafeText style={styles.title}>{title}</SafeText>
      {action && <SafeText style={styles.action}>{action}</SafeText>}
    </View>
  );
};

const makeStyles = (theme) => {
  const padding = getResponsivePadding(16);
  const titleFontSize = getResponsiveFontSize(16, 14, 20);
  const actionFontSize = getResponsiveFontSize(12, 10, 16);

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: padding * 0.75,
      paddingHorizontal: padding,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: '700',
      color: theme.text,
    },
    action: {
      fontSize: actionFontSize,
      color: theme.primary,
      fontWeight: '600',
    },
  });
};
