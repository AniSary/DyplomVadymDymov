/**
 * Categories Screen - управление категориями
 * Добавление, редактирование и удаление категорий
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import {
  CategoryItem,
  Button,
  InputField,
  EmptyState,
} from '../components';
import { calculateCategoryTotal } from '../utils/moneyUtils';

const CategoriesScreen = ({ navigation }) => {
  const {
    categories,
    transactions,
    addCategory,
    deleteCategory,
    getCategoriesByType,
    t,
    theme,
  } = useApp();

  const styles = makeStyles(theme);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📌');
  const [newCategoryColor, setNewCategoryColor] = useState('#95A5A6');
  const [sections, setSections] = useState([]);

  // Полностью пересчитываем список при изменении категорий
  useEffect(() => {
    const updateSections = () => {
      try {
        const expenseCategories = categories.filter(c => c.type === 'expense');
        const incomeCategories = categories.filter(c => c.type === 'income');

        const expenseSection = {
          title: t('Expense Categories') || 'Expense Categories',
          data: expenseCategories.map(cat => ({
            ...cat,
            total: calculateCategoryTotal(transactions, cat.id, 'expense'),
          })),
        };

        const incomeSection = {
          title: t('Income Categories') || 'Income Categories',
          data: incomeCategories.map(cat => ({
            ...cat,
            total: calculateCategoryTotal(transactions, cat.id, 'income'),
          })),
        };

        setSections([expenseSection, incomeSection].filter(s => s.data.length > 0));
      } catch (error) {
        console.error('Error updating sections:', error);
      }
    };

    updateSections();
  }, [categories, transactions, t]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert(t('Error'), t('Enter category name'));
      return;
    }

    try {
      await addCategory({
        name: newCategoryName,
        type: newCategoryType,
        icon: newCategoryIcon,
        color: newCategoryColor,
      });

      setNewCategoryName('');
      setNewCategoryType('expense');
      setNewCategoryIcon('📌');
      setNewCategoryColor('#95A5A6');
      setShowAddModal(false);

      Alert.alert(t('Success'), t('Category added'));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить категорию');
      console.error('Add category error:', error);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    // Проверяем, есть ли транзакции с этой категорией
    const hasTransactions = transactions.some(t => String(t.categoryId) === String(categoryId));

    console.log('Delete check:', {
      categoryId: categoryId,
      transactionsCount: transactions.length,
      hasTransactions: hasTransactions,
    });

    if (hasTransactions) {
      Alert.alert(
        t('Cannot delete'),
        t('Category has transactions')
      );
      return;
    }

    // Показываем кастомный модальный диалог
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      console.log('Attempting to delete category:', categoryToDelete);
      
      // Явно вызываем удаление и ждём результата
      await deleteCategory(categoryToDelete);
      
      console.log('Category deleted successfully');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      Alert.alert(t('Success'), t('Category deleted'));
    } catch (error) {
      console.error('Delete category failed:', error);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      Alert.alert(t('Error'), 'Failed to delete category: ' + error.message);
    }
  };

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#A8E6CF',
    '#FF6B9D', '#9B59B6', '#2ECC71', '#3498DB', '#95A5A6',
  ];

  const icons = ['🍔', '🚗', '🎬', '🛍️', '💡', '⚕️', '📚', '💰', '📈', '💻'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Categories') || 'Categories'}</Text>
      </View>

      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={({ item }) => (
            <CategoryItem
              category={item}
              onDelete={handleDeleteCategory}
              showAmount={false}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          keyExtractor={(item, index) => item.id + index}
        />
      ) : (
        <EmptyState
          icon="📁"
          title="Нет категорий"
          description="Добавьте новую категорию"
        />
      )}

      {/* Модальное окно добавления */}
      <Modal
        visible={Boolean(showAddModal)}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('New Category')}</Text>

            <InputField
              label={t('Name')}
              placeholder={t('Enter name')}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            {/* Выбор типа */}
            <Text style={styles.label}>{t('Type')}</Text>
            <View style={styles.typeGroup}>
              {['expense', 'income'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newCategoryType === type && styles.typeButtonSelected,
                  ]}
                  onPress={() => setNewCategoryType(type)}
                >
                  <Text style={styles.typeButtonText}>
                    {type === 'income' ? t('Income') : t('Expense')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Выбор иконки */}
            <Text style={styles.label}>{t('Icon')}</Text>
            <View style={styles.iconGrid}>
              {icons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    newCategoryIcon === icon && styles.iconButtonSelected,
                  ]}
                  onPress={() => setNewCategoryIcon(icon)}
                >
                  <Text style={styles.iconButtonText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Выбор цвета */}
            <Text style={styles.label}>{t('Color')}</Text>
            <View style={styles.colorGrid}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    newCategoryColor === color && styles.colorButtonSelected,
                  ]}
                  onPress={() => setNewCategoryColor(color)}
                />
              ))}
            </View>

            {/* Кнопки */}
            <View style={styles.modalButtons}>
              <Button
                title={t('Cancel')}
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title={t('Add')}
                onPress={handleAddCategory}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно удаления категории */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '80%', padding: 20 }]}>
            <Text style={[styles.modalTitle, { marginBottom: 16 }]}>
              {t('Delete Category')}
            </Text>
            <Text style={[styles.modalTitle, { fontSize: 14, fontWeight: '400', marginBottom: 24 }]}>
              {t('Delete Confirmation')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                title={t('Cancel')}
                variant="outline"
                onPress={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                style={{ flex: 1 }}
              />
              <Button
                title={t('Delete')}
                variant="danger"
                onPress={confirmDeleteCategory}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Кнопка добавления */}
      <View style={styles.footer}>
        <Button
          title={t('Add Category')}
          onPress={() => setShowAddModal(true)}
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
    sectionHeader: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
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
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginTop: 12,
      marginBottom: 8,
    },
    typeGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    typeButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
    },
    typeButtonSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    iconButton: {
      width: '22%',
      aspectRatio: 1,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButtonSelected: {
      borderWidth: 3,
      borderColor: theme.primary,
    },
    iconButtonText: {
      fontSize: 24,
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    colorButton: {
      width: '22%',
      aspectRatio: 1,
      borderRadius: 8,
    },
    colorButtonSelected: {
      borderWidth: 3,
      borderColor: theme.primary,
    },
    modalButtons: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 8,
    },
  });

export default CategoriesScreen;
