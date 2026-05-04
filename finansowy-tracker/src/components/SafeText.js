/**
 * SafeText - компонент для безопасного отображения текста
 * Избегает ошибки "Unexpected text node" на Web платформе
 */

import React from 'react';
import { Text } from 'react-native';

export const SafeText = (props) => {
  return <Text {...props} />;
};

export default SafeText;
