/**
 * Стандартные категории доходов и расходов
 */

export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: '1', nameKey: 'category_food', color: '#FF6B6B', icon: '🍔', type: 'expense' },
  { id: '2', nameKey: 'category_transport', color: '#4ECDC4', icon: '🚗', type: 'expense' },
  { id: '3', nameKey: 'category_entertainment', color: '#FFE66D', icon: '🎬', type: 'expense' },
  { id: '4', nameKey: 'category_shopping', color: '#FF8B94', icon: '🛍️', type: 'expense' },
  { id: '5', nameKey: 'category_utilities', color: '#A8E6CF', icon: '💡', type: 'expense' },
  { id: '6', nameKey: 'category_health', color: '#FF6B9D', icon: '⚕️', type: 'expense' },
  { id: '7', nameKey: 'category_education', color: '#9B59B6', icon: '📚', type: 'expense' },
  { id: '8', nameKey: 'category_other', color: '#95A5A6', icon: '📌', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { id: '101', nameKey: 'category_salary', color: '#2ECC71', icon: '💰', type: 'income' },
  { id: '102', nameKey: 'category_bonus', color: '#27AE60', icon: '🎁', type: 'income' },
  { id: '103', nameKey: 'category_investments', color: '#3498DB', icon: '📈', type: 'income' },
  { id: '104', nameKey: 'category_freelance', color: '#16A085', icon: '💻', type: 'income' },
  { id: '105', nameKey: 'category_gift', color: '#E74C3C', icon: '🎉', type: 'income' },
  { id: '106', nameKey: 'category_other', color: '#95A5A6', icon: '📌', type: 'income' },
];

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];
