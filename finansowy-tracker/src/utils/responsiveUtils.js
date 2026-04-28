// src/utils/responsiveUtils.js
// Утилиты для адаптивного дизайна на разных устройствах

import { Dimensions, Platform } from 'react-native';

let screenDimensions = Dimensions.get('screen');

// Слушаем изменения ориентации
Dimensions.addEventListener('change', ({ screen }) => {
  screenDimensions = screen;
});

/**
 * Получить текущие размеры экрана
 */
export const getScreenDimensions = () => {
  return {
    width: screenDimensions.width,
    height: screenDimensions.height,
  };
};

/**
 * Получить ширину экрана (с учетом safe area)
 */
export const getScreenWidth = () => {
  return screenDimensions.width;
};

/**
 * Получить высоту экрана
 */
export const getScreenHeight = () => {
  return screenDimensions.height;
};

/**
 * Адаптивный размер шрифта
 * Масштабирует шрифт в зависимости от ширины экрана
 * 
 * @param {number} baseSize - базовый размер (для экрана ~400px)
 * @param {number} minSize - минимальный размер
 * @param {number} maxSize - максимальный размер
 */
export const getResponsiveFontSize = (baseSize = 14, minSize = 10, maxSize = 32) => {
  const screenWidth = screenDimensions.width;
  
  // Формула для масштабирования: 
  // На 360px экране (мобила) - baseSize
  // На 1200px экране (планшет) - больше
  const scale = screenWidth / 375; // iPhone 6 ширина за базу
  const newSize = baseSize * scale;
  
  return Math.min(Math.max(newSize, minSize), maxSize);
};

/**
 * Адаптивные отступы (padding/margin)
 */
export const getResponsivePadding = (basePadding = 16) => {
  const screenWidth = screenDimensions.width;
  const scale = screenWidth / 375;
  return basePadding * scale;
};

/**
 * Адаптивность для flex-layouts
 * Возвращает параметры для двухколонка/одноколонка
 */
export const getGridColumns = (minColumnWidth = 150) => {
  const screenWidth = screenDimensions.width;
  const padding = getResponsivePadding(16);
  const availableWidth = screenWidth - padding * 2;
  
  const columns = Math.floor(availableWidth / minColumnWidth);
  return Math.max(1, columns);
};

/**
 * Получить правильный размер для сетки элементов
 */
export const getGridItemSize = (itemsPerRow = 3, gap = 10) => {
  const screenWidth = screenDimensions.width;
  const padding = getResponsivePadding(16);
  const availableWidth = screenWidth - padding * 2;
  const totalGaps = (itemsPerRow - 1) * gap;
  
  return (availableWidth - totalGaps) / itemsPerRow;
};

/**
 * Проверить тип устройства
 */
export const getDeviceType = () => {
  const screenWidth = screenDimensions.width;
  
  if (screenWidth >= 960) return 'tablet'; // iPad Pro
  if (screenWidth >= 600) return 'large-tablet'; // iPad, Android tablets
  if (screenWidth >= 480) return 'mobile'; // Normal phone
  return 'small-mobile'; // Small phones
};

/**
 * Фиксированные размеры для разных устройств
 */
export const getResponsiveStyle = (baseSize) => {
  const deviceType = getDeviceType();
  
  const styles = {
    'small-mobile': { multiplier: 0.85 },
    'mobile': { multiplier: 1 },
    'large-tablet': { multiplier: 1.3 },
    'tablet': { multiplier: 1.5 },
  };
  
  const multiplier = styles[deviceType]?.multiplier || 1;
  return baseSize * multiplier;
};

/**
 * Проверить ориентацию
 */
export const getOrientation = () => {
  const { width, height } = screenDimensions;
  return width > height ? 'landscape' : 'portrait';
};

/**
 * Безопасные области (для notch и т.д.)
 */
export const getSafeAreaPadding = () => {
  if (Platform.OS === 'ios') {
    return {
      top: 44,
      bottom: 34,
      left: 0,
      right: 0,
    };
  }
  return {
    top: 24,
    bottom: 0,
    left: 0,
    right: 0,
  };
};

/**
 * Адаптивные размеры для Button
 */
export const getButtonDimensions = () => {
  const deviceType = getDeviceType();
  
  if (deviceType === 'tablet' || deviceType === 'large-tablet') {
    return {
      paddingVertical: 16,
      paddingHorizontal: 32,
      minHeight: 56,
      fontSize: 16,
    };
  }
  
  return {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
    fontSize: 14,
  };
};

/**
 * Адаптивные размеры для Card
 */
export const getCardPadding = () => {
  const deviceType = getDeviceType();
  
  if (deviceType === 'tablet' || deviceType === 'large-tablet') {
    return {
      padding: 20,
      margin: 12,
      borderRadius: 12,
    };
  }
  
  return {
    padding: 16,
    margin: 10,
    borderRadius: 10,
  };
};

/**
 * Адаптивные размеры для Input
 */
export const getInputDimensions = () => {
  const deviceType = getDeviceType();
  
  if (deviceType === 'tablet' || deviceType === 'large-tablet') {
    return {
      paddingVertical: 14,
      paddingHorizontal: 16,
      minHeight: 52,
      fontSize: 16,
      borderRadius: 10,
    };
  }
  
  return {
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 44,
    fontSize: 14,
    borderRadius: 8,
  };
};

export default {
  getScreenDimensions,
  getScreenWidth,
  getScreenHeight,
  getResponsiveFontSize,
  getResponsivePadding,
  getGridColumns,
  getGridItemSize,
  getDeviceType,
  getResponsiveStyle,
  getOrientation,
  getSafeAreaPadding,
  getButtonDimensions,
  getCardPadding,
  getInputDimensions,
};
