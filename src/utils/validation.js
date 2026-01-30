/**
 * Narzędzia do walidacji
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 999999.99;
};

export const validateCategory = (category) => {
  return category && category.trim().length > 0 && category.trim().length <= 50;
};

export const validateComment = (comment) => {
  return !comment || (comment.trim().length > 0 && comment.trim().length <= 200);
};

export const validateTransaction = (transaction) => {
  const errors = {};
  
  if (!validateAmount(transaction.amount)) {
    errors.amount = 'INVALID_AMOUNT';
  }
  
  if (!transaction.categoryId) {
    errors.category = 'SELECT_CATEGORY';
  }
  
  if (!transaction.date) {
    errors.date = 'SELECT_DATE';
  }
  
  if (!validateComment(transaction.comment)) {
    errors.comment = 'COMMENT_TOO_LONG';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
