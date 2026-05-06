# Testing Guide

Полный гайд для тестирования всех функций приложения.

## 🧪 Быстрая проверка

### 1. Проверка Backend

```bash
# Health check
curl http://localhost:3001/health

# Ожидаемый результат:
# {
#   "success": true,
#   "status": "healthy",
#   "service": "finansowy-tracker-backend",
#   "version": "2.0.0"
# }
```

### 2. Проверка Frontend

```bash
cd finansowy-tracker

# Запустить Web версию
npm start

# Нажать 'w' для Web
# Должно открыться http://localhost:8081
```

---

## 📱 Функциональное тестирование

### Test 1: Добавление транзакции
1. Открыть приложение
2. Нажать "Добавить операцию"
3. Заполнить данные:
   - Тип: "Расход"
   - Сумма: "50"
   - Категория: "Еда"
   - Дата: сегодня
   - Комментарий: "Обед"
4. Сохранить ✅

**Проверить:** Транзакция должна появиться в списке и в балансе

### Test 2: Синхронизация данных
1. Добавить несколько транзакций
2. Проверить что они сохраняются локально
3. Если включена синхронизация, данные должны появиться на сервере

**Проверить:**
```bash
# На бэкенде проверить логи синхронизации
tail -f ./data/tracker.db
```

### Test 3: Аналитика
1. Добавить минимум 3 транзакции разных типов
2. Открыть вкладку "Аналитика"
3. Должны отобразиться:
   - Месячная статистика
   - Тренды расходов
   - Прогноз на следующий месяц
   - Рекомендации

**Проверить:**
```bash
# API analytics
curl -H "x-user-id: test-user" \
  http://localhost:3001/api/analytics/summary
```

### Test 4: Многоязычность
1. Открыть Настройки
2. Изменить язык на другой (English, Polski, Русский)
3. Все текст должен смениться на выбранный язык

**Проверить:** 
- Analytics экран должен отобразиться на выбранном языке
- Все labels переведены правильно

### Test 5: Dark/Light Theme
1. Открыть Настройки
2. Нажать на переключатель темы
3. Интерфейс должен смениться

**Проверить:** Все компоненты корректно отображаются в обеих темах

---

## 🔌 API Integration Testing

### Test Sync Push

```bash
curl -X POST http://localhost:3001/api/sync/push \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "transactions": [{
      "id": "tx-001",
      "type": "expense",
      "amount": 100,
      "category": "Food",
      "date": "2024-05-06T10:00:00Z",
      "description": "Lunch",
      "version": 1,
      "updatedAt": "2024-05-06T10:00:00Z"
    }],
    "deviceId": "device-001",
    "lastSyncTime": "2024-05-01T00:00:00Z"
  }'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "data": {
    "uploaded": [...],
    "conflicts": [],
    "errors": []
  }
}
```

### Test Sync Pull

```bash
curl -X POST http://localhost:3001/api/sync/pull \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "lastSyncTime": "2024-05-01T00:00:00Z",
    "deviceId": "device-001"
  }'
```

### Test Analytics Summary

```bash
curl -H "x-user-id: test-user-123" \
  "http://localhost:3001/api/analytics/summary?period=month"
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000,
    "totalExpense": 1500,
    "balance": 3500,
    "transactionCount": 25
  }
}
```

---

## ✅ Error Handling Testing

### Test Invalid userId

```bash
curl http://localhost:3001/api/sync/push \
  -X POST \
  -H "Content-Type: application/json"

# Expected: 401 INVALID_USER_ID
```

### Test Invalid Transaction

```bash
curl -X POST http://localhost:3001/api/sync/push \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "transactions": [{
      "type": "invalid",
      "amount": -100
    }],
    "deviceId": "device-001"
  }'

# Expected: Validation errors in response
```

### Test Missing Fields

```bash
curl -X POST http://localhost:3001/api/sync/push \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "deviceId": "device-001"
  }'

# Expected: 400 INVALID_REQUEST
```

---

## 📊 Performance Testing

### Test Load
```bash
# Запустить 100 синхронизаций подряд
for i in {1..100}; do
  curl -X POST http://localhost:3001/api/sync/pull \
    -H "Content-Type: application/json" \
    -H "x-user-id: perf-test-user" \
    -d '{"deviceId": "device-'$i'", "lastSyncTime": "2024-01-01T00:00:00Z"}'
done
```

**Проверить:**
- Сервер не падает
- Response time < 500ms
- Логи ясные и информативные

---

## 🐛 Debugging

### View Backend Logs

```bash
# Development mode с полными логами
npm run dev

# Production mode (Railway)
# Смотреть в Railway dashboard
```

### Console Warnings (Web)

```bash
# Запустить Web версию
npm start

# Нажать 'w'

# Открыть DevTools (F12 или Cmd+Option+I)
# Проверить Console tab
# Должно быть чистым (все warnings подавлены)
```

### Database Inspection

```bash
# Открыть SQLite DB
sqlite3 ./data/tracker.db

# Queries:
# SELECT COUNT(*) FROM transactions;
# SELECT * FROM transactions LIMIT 10;
# SELECT * FROM sync_log ORDER BY timestamp DESC LIMIT 5;
```

---

## ✔️ Pre-Submission Checklist

- [ ] Backend запускается без ошибок
- [ ] Health check возвращает 200
- [ ] API endpoints отвечают правильно
- [ ] Валидация работает
- [ ] Frontend запускается на Web, iOS, Android
- [ ] Все три языка работают
- [ ] Dark/Light theme переключаются
- [ ] Console warnings отсутствуют (на Web)
- [ ] Аналитика считается правильно
- [ ] Синхронизация работает
- [ ] Error handling работает
- [ ] Документация актуальна
