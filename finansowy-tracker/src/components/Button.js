/**
 * Компонент кнопки с полной адаптивностью
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getButtonDimensions, getResponsiveFontSize } from '../utils/responsiveUtils';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  const { theme } = useApp();
  const dimensions = getButtonDimensions();
  const styles = makeStyles(theme, dimensions);

  const buttonStyles = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    size === 'small' && styles.small,
    size === 'large' && styles.large,
    style,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (theme, dimensions) => {
  const fontSize = getResponsiveFontSize(dimensions.fontSize, 12, 20);
  
  return StyleSheet.create({
    button: {
      paddingVertical: dimensions.paddingVertical,
      paddingHorizontal: dimensions.paddingHorizontal,
      minHeight: dimensions.minHeight,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    small: {
      paddingVertical: dimensions.paddingVertical * 0.7,
      paddingHorizontal: dimensions.paddingHorizontal * 0.7,
      minHeight: dimensions.minHeight * 0.85,
    },
    large: {
      paddingVertical: dimensions.paddingVertical * 1.3,
      paddingHorizontal: dimensions.paddingHorizontal * 1.3,
      minHeight: dimensions.minHeight * 1.2,
    },
    primary: {
      backgroundColor: theme.primary,
    },
    secondary: {
      backgroundColor: theme.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    danger: {
      backgroundColor: theme.error,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize,
      fontWeight: '600',
    },
    primaryText: {
      color: '#FFFFFF',
    },
    secondaryText: {
      color: '#FFFFFF',
    },
    outlineText: {
      color: theme.primary,
    },
    dangerText: {
      color: '#FFFFFF',
    },
  });
};

export default Button;
