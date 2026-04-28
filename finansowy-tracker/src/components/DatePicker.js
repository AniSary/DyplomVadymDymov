/**
 * Компонент для выбора даты
 */

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';
import { Button } from './Button';

export const DatePicker = ({ value, onChange, label, error, style }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(value || Date.now()));
  const { theme, t } = useApp();
  const styles = makeStyles(theme);

  const handleDateChange = (days) => {
    const newDate = new Date(tempDate);
    newDate.setDate(newDate.getDate() + days);
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    onChange(tempDate.toISOString());
    setShowPicker(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.button, error && styles.buttonError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>📅 {formatDate(value || new Date())}</Text>
      </TouchableOpacity>

      {error && <Text style={[styles.error, { color: theme.error }]}>{typeof error === 'string' ? (t(error) || error) : error}</Text>}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }] }>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('Select date') || 'Select date'}</Text>

            <View style={[styles.dateDisplay, { backgroundColor: theme.surface }]}>
              <Text style={[styles.dateText, { color: theme.primary }]}>{formatDate(tempDate)}</Text>
            </View>

            <View style={styles.controls}>
              <Button
                title={(t('Yesterday') ? '← ' + t('Yesterday') : '← Yesterday')}
                variant="outline"
                onPress={() => handleDateChange(-1)}
              />
              <Button
                title={(t('Today') ? t('Today') + ' →' : 'Today →')}
                variant="outline"
                onPress={() => setTempDate(new Date())}
              />
              <Button
                title={(t('Tomorrow') ? 'Tomorrow →' : 'Tomorrow →')}
                variant="outline"
                onPress={() => handleDateChange(1)}
              />
            </View>

            <View style={styles.buttonGroup}>
              <Button
                title={t('Cancel') || 'Cancel'}
                variant="outline"
                onPress={() => setShowPicker(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={t('Done') || 'Done'}
                onPress={handleConfirm}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    button: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: theme.surface,
      alignItems: 'center',
    },
    buttonError: {
      borderColor: theme.error,
    },
    buttonText: {
      fontSize: 16,
      color: theme.text,
    },
    error: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      paddingBottom: 32,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    dateDisplay: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    dateText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    controls: {
      marginBottom: 16,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 8,
    },
  });
