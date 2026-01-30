/**
 * Ekran AddTransaction - ekran dodawania operacji
 * Pozwala na dodawanie dochodów i wydatków z wybraniem kategorii i daty
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import {
  InputField,
  Button,
  TypeSelector,
  CategorySelector,
  DatePicker,
} from '../components';
import { validateTransaction } from '../utils/validation';

const AddTransactionScreen = ({ navigation, route }) => {
  const { addTransaction, getCategoriesByType, theme, t } = useApp();
  const styles = makeStyles(theme);
  const editingTransaction = route.params?.transaction;

  const [type, setType] = useState(editingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(
    editingTransaction?.categoryId ? { id: editingTransaction.categoryId } : null
  );
  const [date, setDate] = useState(editingTransaction?.date || new Date().toISOString());
  const [comment, setComment] = useState(editingTransaction?.comment || '');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = getCategoriesByType(type);

  const handleAddTransaction = async () => {
    const transaction = {
      type,
      amount: parseFloat(amount),
      categoryId: selectedCategory?.id,
      date,
      comment,
    };

    const { isValid, errors: validationErrors } = validateTransaction(transaction);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await addTransaction(transaction);
      
      Alert.alert(t('Success') || 'Success', t('Transaction added') || 'Transaction added');
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('Error') || 'Error', t('Failed to add transaction') || 'Failed to add transaction');
      console.error('Add transaction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }] }>
        <Text style={[styles.title, { color: theme.text }]}>{t('Add Transaction') || 'Add Transaction'}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={Boolean(false)}
      >
        {/* Wybór typu operacji */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('Type') || 'Type'}</Text>
          <TypeSelector
            selected={type}
            onSelect={setType}
          />
        </View>

        {/* Kwota */}
        <View style={styles.section}>
          <InputField
            label={t('Amount') || 'Amount'}
            placeholder={t('Enter amount') || 'Enter amount'}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            error={errors.amount}
          />
        </View>

        {/* Kategoria */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('Category') || 'Category'}</Text>
          <CategorySelector
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          {errors.category && (
            <Text style={[styles.error, { color: theme.error }]}>{t(errors.category)}</Text>
          )}
        </View>

        {/* Data */}
        <View style={styles.section}>
          <DatePicker
            label={t('Date') || 'Date'}
            value={date}
            onChange={setDate}
            error={errors.date}
          />
        </View>

        {/* Komentarz */}
        <View style={styles.section}>
          <InputField
            label={t('Comment (optional)') || 'Comment (optional)'}
            placeholder={t('Add a note') || 'Add a note'}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            error={errors.comment}
          />
        </View>
      </ScrollView>

      {/* Przyciski akcji */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Button
          title={t('Cancel') || 'Cancel'}
          variant="outline"
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 8 }}
        />
        <Button
          title={t('Add') || 'Add'}
          onPress={handleAddTransaction}
          disabled={Boolean(isLoading)}
        />
      </View>
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
    section: {
      paddingHorizontal: 16,
      marginVertical: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    error: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
  });

export default AddTransactionScreen;
