// Prosta implementacja lokalizacji
import pl from '../locales/pl.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

const translations = {
  pl,
  en,
  ru,
};

export const getSupportedLanguages = () => ({
  pl: 'Polski',
  en: 'Angielski',
  ru: 'Rosyjski',
});

export function t(key, lang = 'pl') {
  try {
    return translations[lang] && translations[lang][key]
      ? translations[lang][key]
      : key;
  } catch (e) {
    return key;
  }
}

export default { t, getSupportedLanguages };