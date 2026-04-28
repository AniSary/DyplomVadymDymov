/**
 * Narzędzia do pracy z datami
 */

export const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
};

export const formatTime = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getMonthYear = (date, locale = 'pl') => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  // Use Intl to get locale-aware month and year
  try {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  } catch (e) {
    // Fallback to numeric format
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}.${date.getFullYear()}`;
  }
};

export const getDayName = (date, locale = 'pl') => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  try {
    // short weekday name according to locale
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  } catch (e) {
    const days = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
    return days[date.getDay()];
  }
};

export const isToday = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isThisMonth = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const startOfMonth = (date = new Date()) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const endOfMonth = (date = new Date()) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const addDays = (date, days) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
