// Полная система локализации с автоматическим переводом

import pl from '../locales/pl.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

// Основные локали
const translations = {
  pl,
  en,
  ru,
};

// Кэш автопереводов (в памяти)
const autoTranslationCache = {
  pl: { ...pl },
  en: { ...en },
  ru: { ...ru },
};

// Простой словарь для автоперевода (без API)
// Используется для категорий и продуктов
const autoTranslateMap = {
  en_pl: {
    'Food': 'Jedzenie',
    'Transport': 'Transport',
    'Entertainment': 'Rozrywka',
    'Shopping': 'Zakupy',
    'Utilities': 'Narzędzia',
    'Health': 'Zdrowie',
    'Education': 'Edukacja',
    'Other': 'Inne',
    'Salary': 'Pensja',
    'Bonus': 'Bonus',
    'Investments': 'Inwestycje',
    'Freelance': 'Praca na zlecenie',
    'Gift': 'Prezent',
    'Eat': 'Jedzenie',
    'Drink': 'Napój',
    'Work': 'Praca',
    'Rest': 'Odpoczynek',
    'Play': 'Gra',
  },
  en_ru: {
    'Food': 'Еда',
    'Transport': 'Транспорт',
    'Entertainment': 'Развлечения',
    'Shopping': 'Покупки',
    'Utilities': 'Коммунальные услуги',
    'Health': 'Здоровье',
    'Education': 'Образование',
    'Other': 'Другое',
    'Salary': 'Зарплата',
    'Bonus': 'Бонус',
    'Investments': 'Инвестиции',
    'Freelance': 'Фриланс',
    'Gift': 'Подарок',
    'Eat': 'Еда',
    'Drink': 'Напиток',
    'Work': 'Работа',
    'Rest': 'Отдых',
    'Play': 'Игра',
  },
  pl_en: {
    'Jedzenie': 'Food',
    'Transport': 'Transport',
    'Rozrywka': 'Entertainment',
    'Zakupy': 'Shopping',
    'Narzędzia': 'Utilities',
    'Zdrowie': 'Health',
    'Edukacja': 'Education',
    'Inne': 'Other',
    'Pensja': 'Salary',
    'Bonus': 'Bonus',
    'Inwestycje': 'Investments',
    'Praca na zlecenie': 'Freelance',
    'Prezent': 'Gift',
    'Napój': 'Drink',
    'Praca': 'Work',
    'Odpoczynek': 'Rest',
    'Gra': 'Play',
  },
  pl_ru: {
    'Jedzenie': 'Еда',
    'Transport': 'Транспорт',
    'Rozrywka': 'Развлечения',
    'Zakupy': 'Покупки',
    'Narzędzia': 'Коммунальные услуги',
    'Zdrowie': 'Здоровье',
    'Edukacja': 'Образование',
    'Inne': 'Другое',
    'Pensja': 'Зарплата',
    'Bonus': 'Бонус',
    'Inwestycje': 'Инвестиции',
    'Praca na zlecenie': 'Фриланс',
    'Prezent': 'Подарок',
    'Napój': 'Напиток',
    'Praca': 'Работа',
    'Odpoczynek': 'Отдых',
    'Gra': 'Игра',
  },
  ru_en: {
    'Еда': 'Food',
    'Транспорт': 'Transport',
    'Развлечения': 'Entertainment',
    'Покупки': 'Shopping',
    'Коммунальные услуги': 'Utilities',
    'Здоровье': 'Health',
    'Образование': 'Education',
    'Другое': 'Other',
    'Зарплата': 'Salary',
    'Бонус': 'Bonus',
    'Инвестиции': 'Investments',
    'Фриланс': 'Freelance',
    'Подарок': 'Gift',
    'Напиток': 'Drink',
    'Работа': 'Work',
    'Отдых': 'Rest',
    'Игра': 'Play',
  },
  ru_pl: {
    'Еда': 'Jedzenie',
    'Транспорт': 'Transport',
    'Развлечения': 'Rozrywka',
    'Покупки': 'Zakupy',
    'Коммунальные услуги': 'Narzędzia',
    'Здоровье': 'Zdrowie',
    'Образование': 'Edukacja',
    'Другое': 'Inne',
    'Зарплата': 'Pensja',
    'Бонус': 'Bonus',
    'Инвестиции': 'Inwestycje',
    'Фриланс': 'Praca na zlecenie',
    'Подарок': 'Prezent',
    'Напиток': 'Napój',
    'Работа': 'Praca',
    'Отдых': 'Odpoczynek',
    'Игра': 'Gra',
  },
};

/**
 * Основная функция локализации
 * Используется для всех текстов в приложении (включая ключи из локалей)
 */
export function t(key, lang = 'pl') {
  try {
    // Сначала проверяем в основных локалях (приоритет)
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    // Потом в кэше автопереводов
    if (autoTranslationCache[lang] && autoTranslationCache[lang][key]) {
      return autoTranslationCache[lang][key];
    }
    // Если не найдено, возвращаем ключ
    return key;
  } catch (e) {
    console.warn(`Translation error for key: ${key}, lang: ${lang}`, e);
    return key;
  }
}

/**
 * Функция для автоматического перевода текста
 * Используется для динамических значений (категории, продукты и т.д.)
 * 
 * @param {string} text - текст для перевода
 * @param {string} targetLang - целевой язык (pl, en, ru)
 * @param {string} sourceLang - исходный язык (по умолчанию en)
 * @returns {string} переведённый текст
 */
export function tAuto(text, targetLang = 'pl', sourceLang = 'en') {
  if (!text) return text;

  // Если языки одинаковые, возвращаем текст без изменений
  if (targetLang === sourceLang) {
    return text;
  }

  // Проверяем кэш автопереводов
  if (autoTranslationCache[targetLang] && autoTranslationCache[targetLang][text]) {
    return autoTranslationCache[targetLang][text];
  }

  // Пытаемся найти перевод в словаре
  const mapKey = `${sourceLang}_${targetLang}`;
  if (autoTranslateMap[mapKey] && autoTranslateMap[mapKey][text]) {
    const translated = autoTranslateMap[mapKey][text];
    // Кэшируем результат
    if (!autoTranslationCache[targetLang]) {
      autoTranslationCache[targetLang] = {};
    }
    autoTranslationCache[targetLang][text] = translated;
    return translated;
  }

  // Если перевода нет в словаре, возвращаем оригинальный текст
  // (пользователь будет видеть оригинальное значение)
  return text;
}

/**
 * Функция для добавления нового перевода в кэш
 * Используется когда пользователь добавляет новую категорию или продукт
 */
export function addTranslationToCache(text, translations_map) {
  try {
    // translations_map формат: { pl: 'Jedzenie', ru: 'Еда', en: 'Food' }
    Object.entries(translations_map).forEach(([lang, translated]) => {
      if (!autoTranslationCache[lang]) {
        autoTranslationCache[lang] = {};
      }
      autoTranslationCache[lang][text] = translated;
    });
  } catch (e) {
    console.warn('Error adding translation to cache:', e);
  }
}

/**
 * Функция для массового добавления переводов в словарь
 */
export function addAutoTranslatePair(text, translations_map, sourceLang = 'en') {
  try {
    Object.entries(translations_map).forEach(([targetLang, translated]) => {
      if (sourceLang !== targetLang) {
        const mapKey = `${sourceLang}_${targetLang}`;
        if (!autoTranslateMap[mapKey]) {
          autoTranslateMap[mapKey] = {};
        }
        autoTranslateMap[mapKey][text] = translated;
        // Также добавляем в кэш
        if (!autoTranslationCache[targetLang]) {
          autoTranslationCache[targetLang] = {};
        }
        autoTranslationCache[targetLang][text] = translated;
      }
    });
  } catch (e) {
    console.warn('Error adding auto-translate pair:', e);
  }
}

export const getSupportedLanguages = () => ({
  pl: 'Polski',
  en: 'English',
  ru: 'Русский',
});

export default { t, tAuto, addTranslationToCache, addAutoTranslatePair, getSupportedLanguages };
