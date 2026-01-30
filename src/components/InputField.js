/**
 * Компонент для ввода текста
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import { useApp } from '../context/AppContext';

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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { theme, t } = useApp();
  const styles = makeStyles(theme);

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

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontSize: 16,
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
      minHeight: 80,
    },
    error: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
  });
