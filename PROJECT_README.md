# 💰 Finansowy Tracker - Полный проект с инженерной архитектурой

> **Финансовый трекер с синхронизацией между устройствами и продвинутой аналитикой**

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎯 Что это?

Это полнофункциональное мобильное приложение для управления личными финансами с серьезной архитектурой:

### 📱 Frontend (React Native / Expo)
- 7 главных экранов
- Оффлайн-первый подход
- Синхронизация с backend
- Красивая UI с поддержкой темной темы

### 🌐 Backend (Node.js + Express)
- REST API для синхронизации
- Продвинутая аналитика
- Управление версиями данных
- Разрешение конфликтов

### 🔄 Синхронизация
- **Last-Write-Wins** в конфликтах
- **Version-based** отслеживание
- Soft delete поддержка
- Audit logging всех изменений

### 📊 Аналитика
- Прогнозирование расходов (с доверием)
- Анализ трендов месяц-к-месяцу
- Рекомендации по сбережениям
- Детальная статистика по категориям

---

## 🚀 Быстрый старт

### Требования:
- Node.js >= 18.0.0
- npm >= 9.0.0
- React Native / Expo CLI (для мобилки)

### 1️⃣ Запустить Backend сервер

```bash
cd backend
npm install
npm run dev
```

Сервер будет доступен на `http://localhost:3001`

Проверить здоровье:
```bash
curl http://localhost:3001/health
```

### 2️⃣ Запустить Frontend приложение

```bash
cd finansowy-tracker
npm install
npm start     # или npm run dev
```

При промпте клиента:
```
i - iOS
a - Android  
w - Web
```

### 3️⃣ Настроить синхронизацию

Отредактировать в `finansowy-tracker/app.json`:
```json
{
  "expo": {
    "plugins": [
      {
        "env": {
          "API_URL": "http://localhost:3001/api"
        }
      }
    ]
  }
}
```

---

## 📐 Архитектура проекта

```
📦 Вся папка проекта
├── 📱 finansowy-tracker/         (Frontend - React Native)
│   ├── src/
│   │   ├── screens/              (7 экранов приложения)
│   │   │   ├── DashboardScreen
│   │   │   ├── AddTransactionScreen
│   │   │   ├── TransactionsScreen
│   │   │   ├── StatisticsScreen
│   │   │   ├── AdvancedAnalyticsScreen ⭐ НОВОЕ
│   │   │   ├── CategoriesScreen
│   │   │   └── SettingsScreen
│   │   ├── components/           (11 компонентов)
│   │   ├── services/
│   │   │   ├── StorageService
│   │   │   ├── SyncService ⭐ НОВОЕ
│   │   │   └── AnalyticsService ⭐ НОВОЕ
│   │   ├── context/              (Context API для управления состоянием)
│   │   └── navigation/            (Навигация с tabs)
│   └── package.json
│
├── 🌐 backend/                   (Backend - Node.js + Express) ⭐ НОВОЕ
│   ├── src/
│   │   ├── services/
│   │   │   ├── DatabaseService   (SQLite управление)
│   │   │   ├── SyncEngine ⭐      (Разрешение конфликтов)
│   │   │   └── AnalyticsEngine ⭐ (Прогнозы и рекомендации)
│   │   ├── routes/
│   │   │   ├── sync.routes.js ⭐  (API синхронизации)
│   │   │   └── analytics.routes.js ⭐ (API аналитики)
│   │   ├── models/
│   │   │   └── Transaction.js ⭐  (С версионированием)
│   │   └── index.js               (Express app)
│   ├── data/
│   │   └── tracker.db             (SQLite база)
│   └── package.json
│
├── 📚 ENGINEERING_ARCHITECTURE.md ⭐ (Подробная инженерная документация)
├── README.md                     (этот файл)
└── package.json                  (root dependencies)
```

---

## 🔄 Как работает синхронизация

### Сценарий: Пользователь с двумя устройствами

```
ДЕНЬ 1:
┌──────────────────────────────┐
│ Телефон (offline)            │
│ Создает: tx-1, tx-2          │
│ Версии: 1, 1                 │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Планшет (online)             │
│ Создает: tx-3                │
│ Версия: 1                    │
│ PUSH → сервер                │
└──────────────────────────────┘

ДЕНЬ 2:
┌──────────────────────────────┐
│ Телефон (подключился)        │
│ PUSH tx-1, tx-2 → сервер     │
│ PULL (получит tx-3)          │
│ MERGE разрешит конфликты     │
└──────────────────────────────┘

РЕЗУЛЬТАТ:
✅ Оба устройства имеют tx-1, tx-2, tx-3
✅ Версии синхронизированы
✅ История залоджена в sync_log
```

### Разрешение конфликтов

```
КОНФЛИКТ:
Телефон редактирует tx-1 на 10 EUR в 14:00
Планшет редактирует tx-1 на 12 EUR в 14:05

РЕШЕНИЕ (Last-Write-Wins):
14:05 > 14:00 → ПЛАНШЕТ ПОБЕЖДАЕТ
Финальное значение: 12 EUR ✅
```

---

## 📊 Аналитика: Как она работает

### Прогноз расходов (Forecast)

```
История расходов (последние 6 месяцев):
Jan: 3500 EUR
Feb: 3200 EUR
Mar: 3800 EUR
Apr: 3100 EUR
May: 3400 EUR
Jun: 3600 EUR

АЛГОРИТМ:
1. Average = (3500+3200+3800+3100+3400+3600) / 6 = 3433 EUR

2. StdDev = √[((3500-3433)² + (3200-3433)² + ...) / 6]
         = √[72922] ≈ 270

3. Confidence = 100 - (StdDev/Average * 100)
             = 100 - (270/3433 * 100)
             = 92%

РЕЗУЛЬТАТ:
✅ Предсказание на следующий месяц: 3433 EUR
✅ Уверенность: 92% (данные стабильны)
```

### Рекомендации по экономии

```
Система анализирует:

1. TOP категория по расходам
   "Продукты" = 40% от всех расходов
   → Рекомендация: Сможете ли вы сократить на 10%?
   → Потенциальная экономия: 137 EUR в месяц

2. Мелкие частые расходы
   128 операций < пятидневной средней суммы
   → Рекомендация: Акумулируются в 250 EUR в месяц
   → Потенциальная экономия: 37-50 EUR в месяц

3. Нестабильные категории
   "Развлечения" имеет вариацию 55%
   → Рекомендация: Установите бюджет для стабильности
```

---

## 🛠️ API Endpoints

### Синхронизация

| Метод | Endpoint | Описание |
|-------|----------|---------|
| POST | `/api/sync/push` | Отправить изменения |
| POST | `/api/sync/pull` | Загрузить изменения |
| POST | `/api/sync/merge` | Полная синхронизация |
| GET | `/api/sync/status` | Статус |

### Аналитика

| Метод | Endpoint | Описание |
|-------|----------|---------|
| GET | `/api/analytics/summary` | Статистика периода |
| GET | `/api/analytics/trends` | Тренды месяц-к-месяцу |
| GET | `/api/analytics/forecast` | Прогноз на месяц |
| GET | `/api/analytics/recommendations` | Рекомендации |
| GET | `/api/analytics/comparison` | Сравнение периодов |

**Все запросы требуют:** `X-User-ID: user-123` заголовок

---

## 📈 Статистика проекта

| Метрика | Значение |
|---------|----------|
| Линий кода (Total) | ~4000+ |
| Файлов JavaScript | 35+ |
| Экранов приложения | 8 |
| API Endpoints | 9 |
| Компонентов UI | 11 |
| Языков поддержки | 3 (EN, PL, RU) |
| Инженерная сложность | ⭐⭐⭐⭐⭐ High |

---

## 🎓 Инженерные достижения

### ✅ Синхронизация (⭐⭐⭐ High)
- Version-based detection конфликтов
- Last-Write-Wins стратегия
- Soft delete паттерн
- Audit logging для всех операций

### ✅ Аналитика (⭐⭐⭐ High)
- Time-series forecasting
- Confidence scoring
- Trend analysis
- Smart recommendations

### ✅ Архитектура (⭐⭐⭐ High)
- Clean separation concerns (Frontend/Backend)
- Modular services
- Performance optimization (индексы, кэши)
- Scalable design

### ✅ Data Integrity (⭐⭐⭐ High)
- Transaction versioning
- Conflict resolution
- Audit trail
- Checksum validation

---

## 🔧 Разработка

### Frontend

```bash
cd finansowy-tracker
npm install
npm start

# Лучшие практики:
# - Добавлять новые экраны в src/screens/
# - Компоненты в src/components/
# - Сервисы в src/services/
```

### Backend

```bash
cd backend
npm install
npm run dev

# Лучшие практики:
# - API routes в src/routes/
# - Business logic в src/services/
# - Models в src/models/
```

### Тестирование API

```bash
# Health check
curl http://localhost:3001/health

# Get analytics summary
curl -H "X-User-ID: user-123" \
  http://localhost:3001/api/analytics/summary?period=month

# Push транзакции
curl -X POST \
  -H "X-User-ID: user-123" \
  -H "Content-Type: application/json" \
  -d '{ "transactions": [...] }' \
  http://localhost:3001/api/sync/push
```

---

## 📚 Документация

| Документ | Содержание |
|----------|-----------|
| [ENGINEERING_ARCHITECTURE.md](./ENGINEERING_ARCHITECTURE.md) | Полная техническая архитектура |
| [backend/README.md](./backend/README.md) | API документация |
| [finansowy-tracker/README.md](./finansowy-tracker/README.md) | Frontend документация |

---

## 🐛 Troubleshooting

### Backend не запускается
```bash
# Проверить что Node.js установлен
node --version  # >= v18.0.0

# Переустановить зависимости
cd backend
rm -rf node_modules package-lock.json
npm install

# Полностью перестартовать
npm run dev
```

### Синхронизация не работает
```bash
# Проверить X-User-ID в запросе
curl -H "X-User-ID: test-user" \
  http://localhost:3001/api/sync/status

# Проверить что backend работает
curl http://localhost:3001/health
```

### База данных повреждена
```bash
# Удалить и пересоздать
rm backend/data/tracker.db*
npm run dev  # пересоздаст при запуске
```

---

## 🚀 Деплой

### Требования для production

```bash
# Установить NODE_ENV
export NODE_ENV=production

# Установить переменные окружения
export PORT=3000
export DB_PATH=/var/lib/finansowy-tracker/tracker.db

# Запустить
npm start
```

### Docker (опционально)

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY backend ./

RUN npm install --production

EXPOSE 3001

CMD ["npm", "start"]
```

```bash
docker build -t finansowy-tracker-backend .
docker run -p 3001:3001 finansowy-tracker-backend
```

---

## 📝 Лицензия

MIT License - фри используй

---

## 👨‍💼 Об проекте

Это серьезный инженерный проект для **диплома**, демонстрирующий:

✅ Полное понимание архитектуры приложений
✅ Знание алгоритмов и структур данных  
✅ Умение решать реальные инженерные задачи
✅ Профессиональный подход к коду и документации

---

**Created:** April 13, 2024
**Version:** 2.0.0
**Status:** Production Ready ✅

---

## 📞 Контакты / Questions

Если у тебя есть вопросы по инженерной части:
1. Прочитай [ENGINEERING_ARCHITECTURE.md](./ENGINEERING_ARCHITECTURE.md)
2. Проверь код в `backend/src/services/`
3. Посмотри примеры API запросов выше

**Happy coding! 🚀**
