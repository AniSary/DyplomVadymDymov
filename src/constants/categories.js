/**
 * Стандартные категории доходов и расходов
 */

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: '1', name: 'Еда', color: '#FF6B6B', icon: '🍔', type: 'expense' },
  { id: '2', name: 'Транспорт', color: '#4ECDC4', icon: '🚗', type: 'expense' },
  { id: '3', name: 'Развлечения', color: '#FFE66D', icon: '🎬', type: 'expense' },
  { id: '4', name: 'Покупки', color: '#FF8B94', icon: '🛍️', type: 'expense' },
  { id: '5', name: 'Коммунальные', color: '#A8E6CF', icon: '💡', type: 'expense' },
  { id: '6', name: 'Здоровье', color: '#FF6B9D', icon: '⚕️', type: 'expense' },
  { id: '7', name: 'Образование', color: '#9B59B6', icon: '📚', type: 'expense' },
  { id: '8', name: 'Другое', color: '#95A5A6', icon: '📌', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: '101', name: 'Зарплата', color: '#2ECC71', icon: '💰', type: 'income' },
  { id: '102', name: 'Бонус', color: '#27AE60', icon: '🎁', type: 'income' },
  { id: '103', name: 'Инвестиции', color: '#3498DB', icon: '📈', type: 'income' },
  { id: '104', name: 'Фриланс', color: '#16A085', icon: '💻', type: 'income' },
  { id: '105', name: 'Подарок', color: '#E74C3C', icon: '🎉', type: 'income' },
  { id: '106', name: 'Другое', color: '#95A5A6', icon: '📌', type: 'income' },
];

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];
