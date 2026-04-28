/**
 * Компонент пустого состояния
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Button } from './Button';
import { useApp } from '../context/AppContext';

export const EmptyState = ({
  icon = '📭',
  title = 'Нет данных',
  description = 'Начните с добавления операции',
  buttonText,
  onButtonPress,
  style,
}) => {
  const { theme } = useApp();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {buttonText && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    icon: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    button: {
      marginHorizontal: 32,
    },
  });
