# 🚀 Finansowy Tracker - Backend Server

Сервер синхронизации и аналитики для мобильного приложения Finansowy Tracker.

## 🎯 Основные направления

### 1. Синхронизация данных между устройствами
- Version-based conflict resolution
- Offline-first поддержка
- Last-Write-Wins стратегия
- Audit logging всех изменений

### 2. Продвинутая аналитика
- Прогнозирование расходов на следующий месяц
- Анализ трендов между периодами
- Умные рекомендации по сбережениям
- Детальная статистика по категориям

---

## 📋 Требования

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **SQLite3** (автоматически устанавливается)

---

## 🔧 Установка и запуск

### 1. Установить зависимости

```bash
cd backend
npm install
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

Содержимое `.env`:
```env
PORT=3001
NODE_ENV=development
DB_PATH=./data/tracker.db
SYNC_CONFLICT_STRATEGY=last-write-wins
CORS_ORIGIN=*
LOG_LEVEL=info
```

### 3. Запустить сервер

```bash
# Development mode с автоперезагрузкой
npm run dev

# Production mode
npm start
```

После запуска сервер будет доступен на `http://localhost:3001`

### 4. Проверить здоровье сервера

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "service": "finansowy-tracker-backend",
  "version": "2.0.0"
}
```

---

## 📡 API Endpoints

### Authentication
Все requests требуют заголовок:
```
x-user-id: {userId}
```

### Sync API (`/api/sync`)
- `POST /sync/push` - Отправить изменения на сервер
- `POST /sync/pull` - Получить изменения с сервера
- `POST /sync/merge` - Разрешить конфликты
- `GET /sync/health` - Проверка здоровья sync API

### Analytics API (`/api/analytics`)
- `GET /analytics/summary?period=month` - Сводная статистика
- `GET /analytics/trends` - Анализ трендов
- `GET /analytics/forecast` - Прогноз расходов
- `GET /analytics/recommendations` - Рекомендации по сбережениям
- `GET /analytics/health` - Проверка здоровья analytics API

**📖 Полная документация API:** См. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🗄️ База данных

### Структура БД
- **transactions** - Таблица с транзакциями
  - id, userId, type (income/expense), amount, category, date, description, version, deviceId, createdAt, updatedAt, isDeleted

- **sync_log** - Лог всех синхронизаций
  - id, userId, action, transactionId, details, timestamp

- **Indexes** для быстрого поиска:
  - userId, version, updatedAt, deviceId

### Инициализация БД
База данных автоматически создается и инициализируется при первом запуске сервера.

### 3. Запустить сервер

**Режим разработки (с автоперезагрузкой):**
```bash
npm run dev
```

**Режим продакшена:**
```bash
npm start
```

Сервер запустится на `http://localhost:3001`

---

## 📡 API Endpoints

### 🔄 Синхронизация (`/api/sync`)

#### `POST /api/sync/push`
Отправить изменения с клиента на сервер

**Request:**
```json
{
  "transactions": [
    {
      "id": "tx-123",
      "userId": "user-1",
      "amount": 25.50,
      "type": "expense",
      "category": "Food",
      "description": "Lunch",
      "date": "2024-04-13T12:00:00Z",
      "version": 1,
      "createdAt": "2024-04-13T12:00:00Z",
      "updatedAt": "2024-04-13T12:00:00Z"
    }
  ],
  "deviceId": "phone-123",
  "lastSyncTime": "2024-04-13T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "uploaded": [
      { "id": "tx-123", "version": 2, ... }
    ],
    "conflicts": [],
    "errors": []
  },
  "serverTime": "2024-04-13T12:05:00Z"
}
```

#### `POST /api/sync/pull`
Загрузить изменения с сервера на клиент

**Request:**
```json
{
  "lastSyncTime": "2024-04-13T10:00:00Z",
  "deviceId": "phone-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [ ... ],
    "deletedTransactions": [ ... ],
    "syncLog": [ ... ]
  },
  "checksum": "abc123def456"
}
```

#### `POST /api/sync/merge`
Полная синхронизация с разрешением конфликтов

**Request:**
```json
{
  "localTransactions": [ ... ],
  "lastSyncTime": "2024-04-13T10:00:00Z",
  "deviceId": "phone-123"
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "applied": [
      { "type": "UPLOAD", "transaction": { ... } },
      { "type": "DOWNLOAD", "transaction": { ... } },
      { "type": "DELETE", "id": "tx-456" }
    ],
    "conflicts": [
      { "id": "tx-789", "resolution": { ... } }
    ]
  },
  "stats": {
    "total": 10,
    "uploads": 3,
    "downloads": 2,
    "conflicts": 1,
    "deletes": 1,
    "syncs": 3
  }
}
```

#### `GET /api/sync/status`
Получить статус синхронизации

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 245,
    "lastSyncChanges": 5,
    "lastSyncLog": [ ... ]
  }
}
```

### 📊 Аналитика (`/api/analytics`)

#### `GET /api/analytics/summary?period=month`
Статистика за период (month, quarter, year, week)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "totalIncome": 5000,
    "totalExpense": 3200,
    "balance": 1800,
    "transactionCount": 45,
    "avgTransaction": 40,
    "byCategory": {
      "Food": { "amount": 1200, "count": 28 },
      "Transport": { "amount": 600, "count": 10 }
    }
  }
}
```

#### `GET /api/analytics/trends`
Анализ трендов месяц-к-месяцу

**Response:**
```json
{
  "success": true,
  "data": {
    "currentMonth": 3500,
    "lastMonth": 3200,
    "changePercent": 9.4,
    "recommendation": "Расходы выросли на 9.4%...",
    "trending": {
      "Food": { "current": 1200, "last": 1100, "changePercent": 9.1 },
      "Transport": { "current": 600, "last": 650, "changePercent": -7.7 }
    }
  }
}
```

#### `GET /api/analytics/forecast`
Прогноз расходов на следующий месяц

**Response:**
```json
{
  "success": true,
  "data": {
    "predictedAmount": 3450,
    "confidence": 87,
    "method": "simple-average",
    "monthsAnalyzed": 6,
    "minMonth": 3100,
    "maxMonth": 3800
  }
}
```

#### `GET /api/analytics/recommendations`
Рекомендации по экономии

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "priority": "high",
      "category": "Food",
      "percentage": 35.5,
      "message": "Food занимает 35.5% расходов. Сможете ли вы сократить на 10%?",
      "savings": 120
    },
    {
      "priority": "medium",
      "message": "У вас много мелких расходов...",
      "savings": 45
    }
  ]
}
```

#### `GET /api/analytics/comparison?period1=month&period2=year`
Сравнение разных периодов

**Response:**
```json
{
  "success": true,
  "data": {
    "comparison": {
      "period1": { ... },
      "period2": { ... },
      "changePercent": -2.3
    }
  }
}
```

---

## 🗄️ Структура базы данных

### transactions
```sql
id (TEXT PRIMARY KEY)
userId (TEXT)
amount (REAL)
type (TEXT) - 'income' or 'expense'
category (TEXT)
description (TEXT)
date (TEXT - ISO8601)
version (INTEGER) - ключевое поле для синхронизации!
createdAt (TEXT)
updatedAt (TEXT) - для Last-Write-Wins
deviceId (TEXT)
isDeleted (BOOLEAN) - soft delete
```

### sync_log
```sql
id (INTEGER PRIMARY KEY)
userId (TEXT)
deviceId (TEXT)
transactionId (TEXT)
action (TEXT) - CREATE, UPDATE, DELETE
timestamp (TEXT)
version (INTEGER)
```

### analytics_cache
```sql
id (INTEGER PRIMARY KEY)
userId (TEXT)
period (TEXT) - '2024-04'
metric (TEXT) - 'total_expense', 'total_income'
value (REAL)
cachedAt (TEXT)
```

---

## 🔐 Заголовки запросов

Все запросы должны включать:
```
X-User-ID: user-123
Content-Type: application/json
```

---

## 🚦 Коды ответов

| Код | Описание |
|-----|---------|
| 200 | OK - успешно |
| 400 | Bad Request - неправильные параметры |
| 401 | Unauthorized - отсутствует X-User-ID |
| 404 | Not Found - endpoint не существует |
| 500 | Server Error - ошибка сервера |

---

## 📊 Пример полного цикла синхронизации

```bash
# 1. Проверить статус
curl -H "X-User-ID: user-1" \
  http://localhost:3001/api/sync/status

# 2. Отправить изменения (push)
curl -X POST \
  -H "X-User-ID: user-1" \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [...],
    "deviceId": "phone",
    "lastSyncTime": "2024-04-13T10:00:00Z"
  }' \
  http://localhost:3001/api/sync/push

# 3. Загрузить изменения (pull)
curl -X POST \
  -H "X-User-ID: user-1" \
  -H "Content-Type: application/json" \
  -d '{
    "lastSyncTime": "2024-04-13T10:05:00Z",
    "deviceId": "phone"
  }' \
  http://localhost:3001/api/sync/pull

# 4. Получить аналитику
curl -H "X-User-ID: user-1" \
  http://localhost:3001/api/analytics/summary?period=month

curl -H "X-User-ID: user-1" \
  http://localhost:3001/api/analytics/forecast

curl -H "X-User-ID: user-1" \
  http://localhost:3001/api/analytics/recommendations
```

---

## 🔍 Логирование и отладка

Все запросы логируются:
```
[2024-04-13T10:05:23.456Z] POST /api/sync/push
[2024-04-13T10:05:24.123Z] GET /api/analytics/summary?period=month
```

---

## 📈 Производительность

### Оптимизации
- ✅ Индексы на userId, date, version
- ✅ Кэширование результатов аналитики
- ✅ Soft deletes вместо hard deletes
- ✅ Batch операции для push/pull
- ✅ Пагинация при необходимости

### Benchmark примеры
- 1000 транзакций push: ~200ms
- 1000 транзакций pull: ~150ms
- Аналитика (forecast): ~50ms (кэшировано)

---

## 🐛 Troubleshooting

### "Cannot find module 'sqlite3'"
```bash
npm install --build-from-source
```

### "Port 3001 is already in use"
```bash
# Change PORT in .env
PORT=3002

# Or kill the process
lsof -i :3001
kill -9 <PID>
```

### "Database lock"
- Перезагрузить сервер
- Удалить `./data/tracker.db-wal` файлы

---

## 📚 Дополнительная информация

- Инженерная архитектура: [ENGINEERING_ARCHITECTURE.md](../ENGINEERING_ARCHITECTURE.md)
- Frontend документация: [Frontend README](../finansowy-tracker/README.md)
- Примеры API: [API Examples](./API_EXAMPLES.md)

---

**Версия:** 1.0.0
**Последнее обновление:** 13 апреля 2024
