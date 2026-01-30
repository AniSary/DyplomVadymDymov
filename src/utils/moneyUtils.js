/**
 * Narzędzia do pracy z pieniędzmi
 */

import { CURRENCIES } from '../constants/currencies';

export const formatCurrency = (amount, currency = 'USD') => {
  const currencyData = CURRENCIES[currency];
  if (!currencyData) return amount;
  
  const formatted = Math.abs(amount).toFixed(2);
  const symbol = currencyData.symbol;
  
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};

export const calculateBalance = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    return transaction.type === 'income'
      ? sum + parseFloat(transaction.amount)
      : sum - parseFloat(transaction.amount);
  }, 0);
};

export const calculateCategoryTotal = (transactions, categoryId, type = null) => {
  return transactions
    .filter(t => {
      if (type && t.type !== type) return false;
      return t.categoryId === categoryId;
    })
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
};

export const calculateMonthlyExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
};

export const calculateMonthlyIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
};

export const groupByCategory = (transactions) => {
  const grouped = {};
  
  transactions.forEach(transaction => {
    if (!grouped[transaction.categoryId]) {
      grouped[transaction.categoryId] = [];
    }
    grouped[transaction.categoryId].push(transaction);
  });
  
  return grouped;
};

export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};
