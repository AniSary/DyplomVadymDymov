/**
 * Komponent do wyboru kategorii
 */

import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';

export const CategorySelector = ({
  categories,
  selected,
  onSelect,
  style,
}) => {
  const { theme } = useApp();
  const styles = makeStyles(theme);

  return (
    <ScrollView
      style={[styles.container, style]}
      scrollEnabled={categories.length > 4}
    >
      <View style={styles.grid}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.item,
              selected?.id === category.id && styles.itemSelected,
            ]}
            onPress={() => onSelect(category)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: category.color },
                selected?.id === category.id && styles.iconBoxSelected,
              ]}
            >
              <Text style={styles.icon}>{category.icon}</Text>
            </View>
            <Text
              style={[
                styles.name,
                selected?.id === category.id && styles.nameSelected,
              ]}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    item: {
      width: '30%',
      alignItems: 'center',
      marginVertical: 8,
    },
    itemSelected: {
      opacity: 1,
    },
    iconBox: {
      width: 56,
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    iconBoxSelected: {
      borderWidth: 3,
      borderColor: theme.primary,
    },
    icon: {
      fontSize: 28,
    },
    name: {
      fontSize: 11,
      color: theme.text,
      textAlign: 'center',
    },
    nameSelected: {
      fontWeight: '600',
      color: theme.primary,
    },
  });
