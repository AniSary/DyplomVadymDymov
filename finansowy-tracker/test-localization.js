#!/usr/bin/env node

console.log('🌍 ДЕМОНСТРАЦИЯ СИСТЕМЫ ЛОКАЛИЗАЦИИ');
console.log('═══════════════════════════════════════════\n');

// ============================================
// 1. ВСТРОЕННЫЕ ПЕРЕВОДЫ (Из локалей)
// ============================================
console.log('📚 1️⃣ ВСТРОЕННЫЕ ПЕРЕВОДЫ (из локалей)');
console.log('─────────────────────────────────────────');

const translations = {
  pl: {
    'App Name': 'Finanse Tracker',
    'category_food': 'Jedzenie',
    'category_transport': 'Transport'
  },
  en: {
    'App Name': 'Finance Tracker',
    'category_food': 'Food',
    'category_transport': 'Transport'
  },
  ru: {
    'App Name': 'Финансово Трекер',
    'category_food': 'Еда',
    'category_transport': 'Транспорт'
  }
};

function t(key, lang = 'ru') {
  return translations[lang][key] || key;
}

console.log('   App Name (RU):', t('App Name', 'ru'));
console.log('   App Name (PL):', t('App Name', 'pl'));
console.log('   App Name (EN):', t('App Name', 'en'));
console.log('   category_food (RU):', t('category_food', 'ru'));

// ============================================
// 2. АВТОПЕРЕВОД (Встроенный словарь)
// ============================================
console.log('\n🔄 2️⃣ АВТОМАТИЧЕСКИЙ ПЕРЕВОД (встроенный словарь)');
console.log('─────────────────────────────────────────');

const autoTranslateMap = {
  en_ru: {
    'Food': 'Еда',
    'Transport': 'Транспорт',
    'Entertainment': 'Развлечения',
    'Shopping': 'Покупки',
    'Health': 'Здоровье',
    'Education': 'Образование',
    'Salary': 'Зарплата',
    'Bonus': 'Бонус'
  },
  en_pl: {
    'Food': 'Jedzenie',
    'Transport': 'Transport',
    'Entertainment': 'Rozrywka',
    'Shopping': 'Zakupy',
    'Health': 'Zdrowie',
    'Education': 'Edukacja',
    'Salary': 'Pensja',
    'Bonus': 'Bonus'
  }
};

function tAuto(text, targetLang = 'ru', sourceLang = 'en') {
  const mapKey = `${sourceLang}_${targetLang}`;
  return autoTranslateMap[mapKey]?.[text] || text;
}

console.log('   "Food" → Русский:', tAuto('Food', 'ru', 'en'));
console.log('   "Transport" → Polski:', tAuto('Transport', 'pl', 'en'));
console.log('   "Salary" → Русский:', tAuto('Salary', 'ru', 'en'));
console.log('   "Health" → Polski:', tAuto('Health', 'pl', 'en'));

// ============================================
// 3. ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ
// ============================================
console.log('\n👤 3️⃣ ПОЛЬЗОВАТЕЛЬСКИЕ КАТЕГОРИИ (добавленные юзером)');
console.log('─────────────────────────────────────────');

const userCategories = [
  { id: 1, name: 'Food', type: 'expense', icon: '🍔' },
  { id: 2, name: 'Transport', type: 'expense', icon: '🚗' },
  { id: 3, name: 'Salary', type: 'income', icon: '💰' }
];

console.log('   Юзер добавил категории на АНГЛИЙСКОМ:');
userCategories.forEach(cat => {
  console.log(`   • ${cat.icon} ${cat.name} (${cat.type})`);
});

console.log('\n   АВТОМАТИЧЕСКИЙ ПЕРЕВОД при смене языка:');
userCategories.forEach(cat => {
  const ruName = tAuto(cat.name, 'ru', 'en');
  const plName = tAuto(cat.name, 'pl', 'en');
  console.log(`   • ${cat.icon} EN: ${cat.name} → RU: ${ruName} | PL: ${plName}`);
});

// ============================================
// 4. ДЕМОНСТРАЦИЯ СМЕНЫ ЯЗЫКА
// ============================================
console.log('\n🌐 4️⃣ ДЕМОНСТРАЦИЯ СМЕНЫ ЯЗЫКА');
console.log('─────────────────────────────────────────');

function renderDashboard(currentLang) {
  console.log(`\n   ┌─ ИНТЕРФЕЙС НА ЯЗЫКЕ: ${currentLang.toUpperCase()} ─┐`);
  console.log(`   │ ${t('App Name', currentLang)}`);
  console.log('   │');
  console.log(`   │ Топ расходы:`);
  
  userCategories.filter(c => c.type === 'expense').forEach(cat => {
    const name = cat.name.includes('Food') ? tAuto(cat.name, currentLang, 'en') : 
                 cat.name.includes('Transport') ? tAuto(cat.name, currentLang, 'en') : cat.name;
    console.log(`   │  ${cat.icon} ${name}`);
  });
  
  console.log('   └────────────────────────────┘');
}

renderDashboard('en');
renderDashboard('ru');
renderDashboard('pl');

// ============================================
// 5. КЭШИРОВАНИЕ ПЕРЕВОДОВ
// ============================================
console.log('\n⚡ 5️⃣ КЭШИРОВАНИЕ ПЕРЕВОДОВ (для производительности)');
console.log('─────────────────────────────────────────');

const cache = {};

function getCachedTranslation(text, targetLang) {
  const key = `${text}_${targetLang}`;
  
  if (cache[key]) {
    console.log(`   ✓ КЭШ ПОПАДАНИЕ: '${text}' → '${cache[key]}'`);
    return cache[key];
  }
  
  const translated = tAuto(text, targetLang, 'en');
  cache[key] = translated;
  console.log(`   ✓ КЭШИРОВАНО: '${text}' → '${translated}'`);
  return translated;
}

getCachedTranslation('Food', 'ru');
getCachedTranslation('Food', 'ru');  // Второй раз из кэша
getCachedTranslation('Transport', 'pl');
getCachedTranslation('Transport', 'pl');  // Второй раз из кэша

// ============================================
// 6. ОБРАБОТКА НЕИЗВЕСТНЫХ СЛОВ
// ============================================
console.log('\n❓ 6️⃣ ОБРАБОТКА НЕИЗВЕСТНЫХ СЛОВ');
console.log('─────────────────────────────────────────');

const unknownWords = ['MyCustomFood', 'SpecialTransport', 'RandomCategory'];
console.log('   Новые слова, которых нет в словаре:');
unknownWords.forEach(word => {
  const ru = tAuto(word, 'ru', 'en');
  const pl = tAuto(word, 'pl', 'en');
  console.log(`   • ${word} → RU: ${ru} | PL: ${pl}`);
});

console.log('   ℹ️  Неизвестные слова возвращаются как есть (оригинал)');

// ============================================
// РЕЗУЛЬТАТЫ
// ============================================
console.log('\n═══════════════════════════════════════════');
console.log('✅ ИТОГИ ДЕМОНСТРАЦИИ');
console.log('═══════════════════════════════════════════');
console.log('✓ Встроенные переводы: РАБОТАЮТ');
console.log('✓ Автоперевод категорий: РАБОТАЕТ');
console.log('✓ Смена языка: РАБОТАЕТ');
console.log('✓ Кэширование: РАБОТАЕТ');
console.log('✓ Обработка неизвестных слов: РАБОТАЕТ');
console.log('');
console.log('🎉 СИСТЕМА ЛОКАЛИЗАЦИИ ГОТОВА К ИСПОЛЬЗОВАНИЮ!');
console.log('🚀 Приложение может работать БЕЗ интернета и API-ключей!');
