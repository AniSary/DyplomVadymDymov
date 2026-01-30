/**
 * Ekran ustawień - ustawienia aplikacji
 * Waluta, motyw, reset danych, informacje o aplikacji
 */

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../constants/currencies';
import { Button, SectionHeader } from '../components';

// Dostęp do motywu wewnątrz komponentu (przez useApp)

const SettingsScreen = ({ navigation }) => {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportData,
    transactions,
    t,
    setLanguage,
    supportedLanguages,
    theme,
  } = useApp();

  const styles = makeStyles(theme);

  const [localSettings, setLocalSettings] = useState(settings);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLocalSettings(settings);
    }, [settings])
  );

  const handleCurrencyChange = async (currency) => {
    await updateSettings({ currency });
    setShowCurrencyPicker(false);
  };

  const handleThemeChange = async (theme) => {
    await updateSettings({ theme });
  };

  const handleLanguageChange = async (language) => {
    await setLanguage(language);
    setShowLanguagePicker(false);
  };

  const handleResetData = () => {
    Alert.alert(
      t('Reset Confirmation Title'),
      t('Reset Confirmation Message'),
      [
        { text: t('Cancel'), onPress: () => {} },
        {
          text: t('Reset'),
          onPress: async () => {
            try {
              await resetAllData();
              Alert.alert(t('Success'), t('Success'));
            } catch (error) {
              Alert.alert(t('Error'), t('Error'));
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const json = JSON.stringify(data, null, 2);
      
      // W prawdziwej aplikacji używane byłoby API do udostępniania plików
      Alert.alert(
        t('Exported'),
        `${t('Total Transactions')}: ${data.transactions.length}\n${new Date().toLocaleString()}`
      );
    } catch (error) {
      Alert.alert(t('Export Error'), t('Error'));
    }
  };

  const totalTransactions = transactions.length;
  const currentCurrency = CURRENCIES[localSettings.currency || 'USD'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Settings')}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Waluta */}
        <SectionHeader title={t('Currency')} style={styles.sectionHeader} />
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <View>
            <Text style={styles.settingLabel}>{t('Currency')}</Text>
            <Text style={styles.settingValue}>
              {currentCurrency?.name} ({currentCurrency?.code})
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Język */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowLanguagePicker(true)}
        >
          <View>
            <Text style={styles.settingLabel}>{t('Language')}</Text>
            <Text style={styles.settingValue}>
              {supportedLanguages[localSettings.language || 'pl']}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Motyw */}
        <SectionHeader title={t('Appearance')} style={styles.sectionHeader} />
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>{t('Appearance')}</Text>
            <Text style={styles.settingValue}>
              {localSettings.theme === 'dark' ? t('Theme Dark') : t('Theme Light')}
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.themeLabel}>
              {localSettings.theme === 'light' ? '☀️' : '🌙'}
            </Text>
            <Switch
              value={Boolean(localSettings.theme === 'dark')}
              onValueChange={(value) =>
                handleThemeChange(value ? 'dark' : 'light')
              }
              trackColor={{ false: '#ccc', true: '#767577' }}
              thumbColor={localSettings.theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Powiadomienia */}
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>{t('Notifications')}</Text>
            <Text style={styles.settingValue}>
              {localSettings.notifications !== false ? t('Enabled') : t('Disabled')}
            </Text>
          </View>
          <Switch
            value={Boolean(localSettings.notifications !== false)}
            onValueChange={(value) =>
              updateSettings({ notifications: value })
            }
            trackColor={{ false: '#ccc', true: '#767577' }}
            thumbColor={localSettings.notifications !== false ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        {/* Informacje */}
        <SectionHeader title={t('Information')} style={styles.sectionHeader} />
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('App Version')}</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('Total Transactions')}</Text>
            <Text style={styles.infoValue}>{totalTransactions}</Text>
          </View>
        </View>

        {/* Dane */}
        <SectionHeader title={t('Data')} style={styles.sectionHeader} />
        <Button
          title={`📤 ${t('Export Data')}`}
          variant="outline"
          onPress={handleExportData}
          style={styles.button}
        />

        <Button
          title={`🔄 ${t('Sync')}`}
          variant="outline"
          onPress={() => Alert.alert(t('Sync'), t('Success'))}
          style={styles.button}
        />

        {/* Niebezpieczne akcje */}
        <SectionHeader title={t('Danger Zone')} style={styles.sectionHeader} />
        <Button
          title={`🗑️ ${t('Reset All Data')}`}
          variant="danger"
          onPress={handleResetData}
          style={styles.button}
        />

        {/* Информация о приложении */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            💰 Финансово Трекер v1.0.0
          </Text>
          <Text style={styles.footerText}>
            Управляй своими финансами легко и просто
          </Text>
          <Text style={styles.footerText}>© 2024 Все права защищены</Text>
        </View>
      </ScrollView>

      {/* Модальное окно выбора валюты */}
      <Modal
        visible={Boolean(showCurrencyPicker)}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Select Currency')}</Text>

            {Object.entries(CURRENCIES).map(([code, currency]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.currencyOption,
                  localSettings.currency === code && styles.currencyOptionSelected,
                ]}
                onPress={() => handleCurrencyChange(code)}
              >
                <View>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                  <Text style={styles.currencyCode}>{code}</Text>
                </View>
                <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              </TouchableOpacity>
            ))}

            <Button
              title={t('Close')}
              onPress={() => setShowCurrencyPicker(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Модальное окно выбора языка */}
      <Modal
        visible={Boolean(showLanguagePicker)}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Select Language')}</Text>

            {Object.entries(supportedLanguages).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.currencyOption,
                  localSettings.language === code && styles.currencyOptionSelected,
                ]}
                onPress={() => handleLanguageChange(code)}
              >
                <View>
                  <Text style={styles.currencyName}>{name}</Text>
                  <Text style={styles.currencyCode}>{code}</Text>
                </View>
                <Text style={styles.currencySymbol}>{code.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}

            <Button
              title={t('Close')}
              onPress={() => setShowLanguagePicker(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      flex: 1,
      paddingVertical: 8,
    },
    sectionHeader: {
      marginTop: 8,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    settingValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginTop: 4,
    },
    chevron: {
      fontSize: 24,
      color: theme.textSecondary,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    themeLabel: {
      fontSize: 20,
    },
    infoContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.surface,
      marginHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    button: {
      marginHorizontal: 16,
      marginVertical: 6,
    },
    footerInfo: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 4,
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
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    currencyOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginBottom: 8,
      borderRadius: 8,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    currencyOptionSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    currencyName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    currencyCode: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    currencySymbol: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
    },
    modalButton: {
      marginTop: 16,
    },
  });

export default SettingsScreen;
