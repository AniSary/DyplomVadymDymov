/**
 * Доступные валюты
 */

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'Доллар США' },
  EUR: { code: 'EUR', symbol: '€', name: 'Евро' },
  GBP: { code: 'GBP', symbol: '£', name: 'Фунт стерлинг' },
  UAH: { code: 'UAH', symbol: '₴', name: 'Украинская гривня' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Польский злотый' },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Чешская крона' },
};

export const DEFAULT_CURRENCY = 'USD';
