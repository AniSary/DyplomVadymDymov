# 📚 Примеры и рецепты

## Примеры использования API приложения

### 1. Работа с транзакциями

#### Добавление новой транзакции

```javascript
import { useApp } from '../context/AppContext';

const MyComponent = () => {
  const { addTransaction } = useApp();

  const handleAddExpense = async () => {
    const transaction = {
      type: 'expense',
      amount: 150.50,
      categoryId: '1', // ID категории "Еда"
      date: new Date().toISOString(),
      comment: 'Обед в кафе'
    };

    try {
      const newTransaction = await addTransaction(transaction);
      console.log('Операция добавлена:', newTransaction);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return <Button title="Добавить расход" onPress={handleAddExpense} />;
};
```

#### Получение всех операций

```javascript
const MyComponent = () => {
  const { transactions } = useApp();

  return (
    <View>
      {transactions.map(transaction => (
        <Text key={transaction.id}>
          {transaction.amount} на {new Date(transaction.date).toLocaleDateString()}
        </Text>
      ))}
    </View>
  );
};
```

#### Фильтрация операций по типу

```javascript
const MyComponent = () => {
  const { transactions } = useApp();

  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  return (
    <View>
      <Text>Расходов: {expenses.length}</Text>
      <Text>Доходов: {incomes.length}</Text>
    </View>
  );
};
```

#### Удаление операции

```javascript
const { deleteTransaction } = useApp();

const handleDeleteTransaction = async (transactionId) => {
  try {
    await deleteTransaction(transactionId);
    Alert.alert('Успешно', 'Операция удалена');
  } catch (error) {
    Alert.alert('Ошибка', 'Не удалось удалить операцию');
  }
};
```

### 2. Работа с категориями

#### Получение категорий по типу

```javascript
const MyComponent = () => {
  const { getCategoriesByType } = useApp();

  const expenseCategories = getCategoriesByType('expense');
  const incomeCategories = getCategoriesByType('income');

  return (
    <View>
      <Text>Категории расходов: {expenseCategories.length}</Text>
      {expenseCategories.map(category => (
        <Text key={category.id}>{category.icon} {category.name}</Text>
      ))}
    </View>
  );
};
```

#### Получение категории по ID

```javascript
const MyComponent = () => {
  const { getCategoryById } = useApp();

  const category = getCategoryById('1');

  return (
    <Text>{category.icon} {category.name}</Text>
  );
};
```

#### Добавление новой категории

```javascript
const { addCategory } = useApp();

const handleAddCategory = async () => {
  try {
    const newCategory = await addCategory({
      name: 'Путешествия',
      type: 'expense',
      icon: '✈️',
      color: '#2196F3'
    });
    console.log('Категория добавлена:', newCategory);
  } catch (error) {
    console.error('Ошибка:', error);
  }
};
```

### 3. Расчет статистики

#### Получение баланса

```javascript
const MyComponent = () => {
  const { getBalance } = useApp();

  const balance = getBalance();

  return (
    <Text>
      Баланс: ${balance.toFixed(2)}
    </Text>
  );
};
```

#### Расчет расходов за месяц

```javascript
const MyComponent = () => {
  const { getMonthlyExpenses } = useApp();

  const expenses = getMonthlyExpenses();

  return (
    <Text>
      Расходы этого месяца: ${expenses.toFixed(2)}
    </Text>
  );
};
```

#### Расходы по категориям

```javascript
const MyComponent = () => {
  const { getExpensesByCategory, categories } = useApp();

  const expensesByCategory = getExpensesByCategory();

  return (
    <View>
      {Object.entries(expensesByCategory).map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return (
          <View key={categoryId}>
            <Text>{category?.icon} {category?.name}</Text>
            <Text>${amount.toFixed(2)}</Text>
          </View>
        );
      })}
    </View>
  );
};
```

### 4. Работа с форматированием

#### Форматирование валюты

```javascript
import { formatCurrency } from '../utils/moneyUtils';
import { useApp } from '../context/AppContext';

const MyComponent = () => {
  const { settings } = useApp();

  const amount = 1234.56;
  const formatted = formatCurrency(amount, settings.currency);

  return <Text>{formatted}</Text>; // $ 1234.56
};
```

#### Форматирование даты

```javascript
import {
  formatDate,
  formatDateTime,
  getMonthYear,
  getDayName
} from '../utils/dateUtils';

const MyComponent = () => {
  const date = new Date();

  return (
    <View>
      <Text>{formatDate(date)}</Text>          // 25.01.2024
      <Text>{formatDateTime(date)}</Text>      // 25.01.2024 14:30
      <Text>{getMonthYear(date)}</Text>        // Январь 2024
      <Text>{getDayName(date)}</Text>          // Пт
    </View>
  );
};
```

### 5. Валидация данных

#### Валидация операции

```javascript
import { validateTransaction } from '../utils/validation';

const handleAddTransaction = (transaction) => {
  const { isValid, errors } = validateTransaction(transaction);

  if (!isValid) {
    console.log('Ошибки валидации:', errors);
    // errors = {
    //   amount: 'Некорректная сумма...',
    //   category: 'Выберите категорию',
    //   date: 'Выберите дату'
    // }
    return;
  }

  // Добавлять операцию...
};
```

#### Валидация суммы

```javascript
import { validateAmount } from '../utils/validation';

const amount = "150.50";
if (validateAmount(amount)) {
  // Сумма корректна
} else {
  // Сумма некорректна
}
```

### 6. Работа с настройками

#### Получение текущей валюты

```javascript
const MyComponent = () => {
  const { settings } = useApp();

  return (
    <Text>Текущая валюта: {settings.currency}</Text>
  );
};
```

#### Смена валюты

```javascript
const MyComponent = () => {
  const { setCurrency } = useApp();

  const handleChangeCurrency = async (currency) => {
    try {
      await setCurrency(currency);
      Alert.alert('Успешно', 'Валюта изменена');
    } catch (error) {
      Alert.alert('Ошибка');
    }
  };

  return (
    <Button
      title="Выбрать EUR"
      onPress={() => handleChangeCurrency('EUR')}
    />
  );
};
```

#### Смена темы

```javascript
const MyComponent = () => {
  const { settings, setTheme } = useApp();

  const toggleTheme = async () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  return (
    <Button
      title={`Переключить на ${settings.theme === 'light' ? 'темную' : 'светлую'} тему`}
      onPress={toggleTheme}
    />
  );
};
```

### 7. Экспорт и импорт данных

#### Экспорт данных

```javascript
const MyComponent = () => {
  const { exportData } = useApp();

  const handleExport = async () => {
    try {
      const data = await exportData();
      const json = JSON.stringify(data, null, 2);
      // Сохранить json в файл...
      console.log('Данные экспортированы:', json);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось экспортировать');
    }
  };

  return <Button title="Экспортировать" onPress={handleExport} />;
};
```

#### Импорт данных

```javascript
const MyComponent = () => {
  const { importData } = useApp();

  const handleImport = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      await importData(data);
      Alert.alert('Успешно', 'Данные импортированы');
    } catch (error) {
      Alert.alert('Ошибка', 'Неверный формат файла');
    }
  };

  return (
    <Button
      title="Импортировать"
      onPress={() => handleImport(jsonData)}
    />
  );
};
```

### 8. Сброс данных

```javascript
const MyComponent = () => {
  const { resetAllData } = useApp();

  const handleReset = async () => {
    Alert.alert(
      'Сбросить все?',
      'Это удалит все данные (необратимо)',
      [
        { text: 'Отмена', onPress: () => {} },
        {
          text: 'Сбросить',
          onPress: async () => {
            try {
              await resetAllData();
              Alert.alert('Успешно', 'Все данные удалены');
            } catch (error) {
              Alert.alert('Ошибка');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  return <Button title="Сбросить все" onPress={handleReset} />;
};
```

## 🎯 Практические сценарии использования

### Сценарий 1: Добавление ежедневного расхода

```javascript
const DailyExpenseFlow = () => {
  const { addTransaction, getCategoriesByType } = useApp();
  const expenseCategories = getCategoriesByType('expense');

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleAddDaily = async () => {
    if (!amount || !categoryId) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      await addTransaction({
        type: 'expense',
        amount: parseFloat(amount),
        categoryId,
        date: new Date().toISOString(),
      });

      setAmount('');
      setCategoryId('');
      Alert.alert('Успешно', 'Расход добавлен');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить');
    }
  };

  return (
    <View>
      <InputField
        label="Сумма"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      
      <CategorySelector
        categories={expenseCategories}
        selected={expenseCategories.find(c => c.id === categoryId)}
        onSelect={(cat) => setCategoryId(cat.id)}
      />

      <Button title="Добавить" onPress={handleAddDaily} />
    </View>
  );
};
```

### Сценарий 2: Анализ расходов за месяц

```javascript
const MonthlyAnalysis = () => {
  const { getMonthlyExpenses, getExpensesByCategory, categories } = useApp();

  const totalExpenses = getMonthlyExpenses();
  const expensesByCategory = getExpensesByCategory();

  const topExpense = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)[0];

  const topCategory = categories.find(c => c.id === topExpense?.[0]);

  return (
    <View>
      <Card
        title="Итого расходов"
        value={formatCurrency(totalExpenses, 'USD')}
      />

      {topCategory && (
        <Card
          title="Топ категория"
          value={`${topCategory.icon} ${topCategory.name}`}
          subtitle={formatCurrency(topExpense[1], 'USD')}
        />
      )}
    </View>
  );
};
```

### Сценарий 3: Экспорт в CSV (расширение)

```javascript
const exportToCSV = async (transactions, categories) => {
  let csv = 'Дата,Категория,Тип,Сумма,Комментарий\n';

  transactions.forEach(transaction => {
    const category = categories.find(c => c.id === transaction.categoryId);
    const date = new Date(transaction.date).toLocaleDateString();
    const type = transaction.type === 'income' ? 'Доход' : 'Расход';
    
    csv += `"${date}","${category?.name}","${type}","${transaction.amount}","${transaction.comment || ''}"\n`;
  });

  // Сохранить CSV...
  return csv;
};
```

## 📝 Чек-лист для добавления функции

Если вы хотите добавить новую функцию, следуйте этому чек-листу:

- [ ] Определить структуру данных
- [ ] Добавить метод в StorageService
- [ ] Добавить логику в AppContext
- [ ] Создать компоненты UI (если нужны)
- [ ] Добавить экран или обновить существующий
- [ ] Добавить навигацию (если новый экран)
- [ ] Добавить валидацию (если нужна)
- [ ] Добавить тесты (опционально)
- [ ] Обновить документацию
- [ ] Протестировать на устройстве

---

**Версия примеров:** 1.0  
**Дата:** 2024-2025
