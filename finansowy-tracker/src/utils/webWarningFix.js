/**
 * Web console warning suppression
 * Подавляет безопасные warnings на Web платформе
 */

// Подавляем warnings для web platform
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Список warnings которые безопасно игнорировать
  const ignoredWarnings = [
    'Unexpected text node',
    'Cannot record touch without',
    'pointerEvents is deprecated',
    'boxShadow',
    'props are deprecated',
    'aria-hidden',
    'Blocked aria-hidden on an element'
  ];

  console.warn = function(...args) {
    const message = args[0]?.toString() || '';
    
    // Если это warning из нашего списка - пропускаем
    if (ignoredWarnings.some(warning => message.includes(warning))) {
      return;
    }
    
    // Иначе выводим нормально
    originalWarn.apply(console, args);
  };

  console.error = function(...args) {
    const message = args[0]?.toString() || '';
    
    // Если это error из нашего списка - пропускаем
    if (ignoredWarnings.some(warning => message.includes(warning))) {
      return;
    }
    
    // Иначе выводим нормально
    originalError.apply(console, args);
  };
}

export default null;
