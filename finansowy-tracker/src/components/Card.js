/**
 * Компонент для отображения карточки с информацией - адаптивный
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getCardPadding, getResponsiveFontSize } from '../utils/responsiveUtils';

export const Card = ({ title, value, subtitle, color, style, size = 'medium' }) => {
  const { theme } = useApp();
  const background = color || theme.primary;
  const cardDimensions = getCardPadding();
  const styles = makeStyles(cardDimensions, size);

  return (
    <View style={[styles.card, { backgroundColor: background }, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const makeStyles = (cardDimensions, size) => {
  const padding = cardDimensions.padding * (size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1);
  const titleFontSize = getResponsiveFontSize(14, 12, 18);
  const valueFontSize = getResponsiveFontSize(28, 20, 40);
  const subtitleFontSize = getResponsiveFontSize(12, 10, 16);

  return StyleSheet.create({
    card: {
      borderRadius: 16,
      padding,
      marginVertical: cardDimensions.margin,
      marginHorizontal: cardDimensions.margin,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      // Web-specific styles
      ...(typeof window !== 'undefined' && {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }),
    },
    title: {
      fontSize: titleFontSize,
      color: '#FFFFFF',
      fontWeight: '500',
      marginBottom: padding * 0.5,
      opacity: 0.9,
    },
    value: {
      fontSize: valueFontSize,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: padding * 0.25,
    },
    subtitle: {
      fontSize: subtitleFontSize,
      color: '#FFFFFF',
      opacity: 0.8,
    },
  });
};
