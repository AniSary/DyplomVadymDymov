/**
 * Ekran startowy - ekran uruchamiania aplikacji
 * Wyświetlany przy starcie, automatycznie przechodzi do ekranu głównego
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../context/AppContext';

const SplashScreen = ({ navigation }) => {
  const { theme, t } = useApp();

  useEffect(() => {
    // Przejdź do ekranu głównego po 2 sekundach
    const timer = setTimeout(() => {
      navigation.replace('MainStack');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💰</Text>
      <Text style={styles.title}>{t('App Name') || 'Finansowy Tracker'}</Text>
      <Text style={styles.subtitle}>{t('Manage your finances easily') || 'Manage your finances easily'}</Text>
      
      <ActivityIndicator
        size="large"
        color={theme.primary}
        style={styles.loader}
      />
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      fontSize: 80,
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 40,
      textAlign: 'center',
    },
    loader: {
      marginTop: 32,
    },
  });

export default SplashScreen;
