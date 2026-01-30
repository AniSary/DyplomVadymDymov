# 📚 Przykłady i przepisy

## Przykłady użycia API aplikacji

### 1. Praca z transakcjami

#### Dodawanie nowej transakcji

```javascript
import { useApp } from '../context/AppContext';

const MyComponent = () => {
  const { addTransaction } = useApp();

  const handleAddExpense = async () => {
    const transaction = {
      type: 'expense',
      amount: 150.50,
      categoryId: '1', // ID kategorii "Jedzenie"
      date: new Date().toISOString(),
      comment: 'Obiad w kawiarni'
    };

    try {
      const newTransaction = await addTransaction(transaction);
      console.log('Transakcja dodana:', newTransaction);
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  return <Button title="Dodaj wydatek" onPress={handleAddExpense} />;
};
```

#### Pobieranie wszystkich transakcji

```javascript
const MyComponent = () => {
  const { transactions } = useApp();

  return (
    <View>
      {transactions.map(transaction => (
        <Text key={transaction.id}>
          {transaction.amount} na {new Date(transaction.date).toLocaleDateString()}
        </Text>
      ))}
    </View>
  );
};
```

#### Filtrowanie transakcji po typie

```javascript
const MyComponent = () => {
  const { transactions } = useApp();

  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  return (
    <View>
      <Text>Wydatków: {expenses.length}</Text>
      <Text>Przychodów: {incomes.length}</Text>
    </View>
  );
};
```

#### Usuwanie transakcji

```javascript
const { deleteTransaction } = useApp();

const handleDeleteTransaction = async (transactionId) => {
  try {
    await deleteTransaction(transactionId);
    Alert.alert('Sukces', 'Transakcja usunięta');
  } catch (error) {
    Alert.alert('Błąd', 'Nie udało się usunąć transakcji');
  }
};
```

### 2. Praca z kategoriami

#### Pobieranie kategorii według typu

```javascript
const MyComponent = () => {
  const { getCategoriesByType } = useApp();

  const expenseCategories = getCategoriesByType('expense');
  const incomeCategories = getCategoriesByType('income');

  return (
    <View>
      <Text>Kategorie wydatków: {expenseCategories.length}</Text>
      {expenseCategories.map(category => (
        <Text key={category.id}>{category.icon} {category.name}</Text>
      ))}
    </View>
  );
};
```

#### Pobieranie kategorii po ID

```javascript
const MyComponent = () => {
  const { getCategoryById } = useApp();

  const category = getCategoryById('1');

  return (
    <Text>{category.icon} {category.name}</Text>
  );
};
```

#### Dodawanie nowej kategorii

```javascript
const { addCategory } = useApp();

const handleAddCategory = async () => {
  try {
    const newCategory = await addCategory({
      name: 'Podróże',
      type: 'expense',
      icon: '✈️',
      color: '#2196F3'
    });
    console.log('Kategoria dodana:', newCategory);
  } catch (error) {
    console.error('Błąd:', error);
  }
};
```

### 3. Obliczenia statystyk

(…)

Poniżej znajdują się dalsze przykłady: pobieranie salda, obliczanie wydatków miesięcznych, wydatki według kategorii, formatowanie waluty i daty, walidacja danych, zarządzanie ustawieniami, eksport/import danych, reset danych oraz praktyczne scenariusze (dodawanie codziennych wydatków, analiza miesięczna).

> Uwaga: powyższe przykłady zawierają fragmenty kodu gotowe do użycia w komponentach React Native. Kod pozostaje w oryginalnej formie (JSX/JS), natomiast komentarze i opisy zostały przetłumaczone na polski.

