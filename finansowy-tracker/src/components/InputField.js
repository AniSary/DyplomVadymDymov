/**
 * Компонент для ввода текста - адаптивный
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getInputDimensions, getResponsiveFontSize, getResponsivePadding } from '../utils/responsiveUtils';

export const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  editable = true,
  style,
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme, t } = useApp();
  const dimensions = getInputDimensions();
  const styles = makeStyles(theme, dimensions, size);

  const renderedError = error
    ? typeof error === 'string'
      ? t(error) || error
      : error
    : null;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          multiline && styles.inputMultiline,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={Boolean(multiline)}
        numberOfLines={numberOfLines}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={Boolean(editable)}
        placeholderTextColor={theme.textSecondary}
      />
      
      {renderedError && <Text style={styles.error}>{renderedError}</Text>}
    </View>
  );
};

const makeStyles = (theme, dimensions, size) => {
  const multiplier = size === 'small' ? 0.85 : size === 'large' ? 1.2 : 1;
  const padding = getResponsivePadding(8);
  const labelFontSize = getResponsiveFontSize(14, 12, 18);
  const inputFontSize = getResponsiveFontSize(dimensions.fontSize, 12, 18);
  const errorFontSize = getResponsiveFontSize(12, 10, 14);
  const paddingV = dimensions.paddingVertical * multiplier;
  const paddingH = dimensions.paddingHorizontal * multiplier;

  return StyleSheet.create({
    container: {
      marginVertical: padding,
    },
    label: {
      fontSize: labelFontSize,
      fontWeight: '600',
      color: theme.text,
      marginBottom: padding * 0.75,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: dimensions.borderRadius,
      paddingVertical: paddingV,
      paddingHorizontal: paddingH,
      minHeight: dimensions.minHeight * multiplier,
      fontSize: inputFontSize,
      color: theme.text,
      backgroundColor: theme.background,
    },
    inputFocused: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    inputError: {
      borderColor: theme.error,
    },
    inputMultiline: {
      textAlignVertical: 'top',
      minHeight: 80 * multiplier,
    },
    error: {
      fontSize: errorFontSize,
      color: theme.error,
      marginTop: padding * 0.5,
    },
  });
};
