## 🚀 Интеграция Google Translate API (Опционально)

Если вы хотите полноценный перевод **любых** слов (включая неизвестные пользовательские значения), можно добавить Google Translate API.

### ⚠️ Когда это нужно:

- Пользователь добавляет категорию "MySpecialFood" → API автоматически переведёт на все языки
- Нужен перевод очень большого количества новых слов

### ✅ Когда встроенный словарь достаточно (текущее состояние):

- Категории обычно повторяются (Food, Transport, Shopping и т.д.)
- Пользователи добавляют стандартные названия (которые уже в словаре)
- Нет интернета - работает полностью offline
- Бесплатно - без платежей Google

### 🔑 Как добавить Google Translate API:

#### Шаг 1: Получить API-ключ Google

1. Перейдите на https://console.cloud.google.com
2. Создайте проект
3. Включите Google Translate API
4. Создайте Service Account
5. Скачайте JSON-ключ

#### Шаг 2: Обновить i18n.js

Замените функцию `tAuto()` на эту асинхронную версию:

```javascript
const GOOGLE_TRANSLATE_API_KEY = 'YOUR_API_KEY_HERE'; // ⚠️ Вставьте ваш ключ

export async function tAuto(text, targetLang = 'pl', sourceLang = 'en') {
  if (!text || targetLang === sourceLang) return text;

  // Проверяем кэш
  if (autoTranslationCache[targetLang]?.[text]) {
    return autoTranslationCache[targetLang][text];
  }

  // Проверяем встроенный словарь
  const mapKey = `${sourceLang}_${targetLang}`;
  if (autoTranslateMap[mapKey]?.[text]) {
    const translated = autoTranslateMap[mapKey][text];
    autoTranslationCache[targetLang][text] = translated;
    return translated;
  }

  // Используем Google Translate API для неизвестных слов
  try {
    const response = await fetch(
      'https://translation.googleapis.com/language/translate/v2',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang,
          key: GOOGLE_TRANSLATE_API_KEY,
        }),
      }
    );
    const data = await response.json();
    
    if (data?.data?.translations?.[0]?.translatedText) {
      const translated = data.data.translations[0].translatedText;
      // Кэшируем результат
      if (!autoTranslationCache[targetLang]) {
        autoTranslationCache[targetLang] = {};
      }
      autoTranslationCache[targetLang][text] = translated;
      return translated;
    }
  } catch (error) {
    console.warn('Google Translate API error:', error);
  }

  // Если API недоступна, возвращаем оригинал
  return text;
}
```

#### Шаг 3: Обновить компоненты для асинхронности

Компоненты, которые используют `tAuto()`, должны обработать асинхронность:

```javascript
const [translatedName, setTranslatedName] = useState(category.name);

useEffect(() => {
  tAutoTranslate(category.name).then(translated => {
    setTranslatedName(translated);
  });
}, [category.name, language]);

return <Text>{translatedName}</Text>;
```

### ⚖️ Сравнение подходов:

| Параметр | Встроенный словарь | Google API |
|----------|-------------------|------------|
| **Скорость** | ⚡ Мгновенно | 🐢 500-1000ms |
| **Точность** | ✅ Хорошо (для стандартных слов) | ✅✅ Отлично (любые слова) |
| **Интернет** | ❌ Не нужен | ✅ Нужен |
| **Стоимость** | 💰 Бесплатно | 💸 $15 за 1млн символов |
| **Сложность** | 🟢 Простая | 🟡 Средняя |
| **Offline** | ✅ Работает | ❌ Не работает |

### 💡 Рекомендация:

**Для MVP и тестирования:** Используйте встроенный словарь (текущее состояние) ✅

**Для production с большим количеством пользовательских данных:** Интегрируйте Google Translate API 🚀

---

**Текущее состояние: Встроенный словарь достаточен для полноценного тестирования!** ✨
