# Deployment Guide

Полный гайд для развертывания приложения на продакшене.

## 🚀 Backend Deployment (Railway)

### 1. Подготовка

Убедитесь что у вас есть:
- GitHub account
- Railway account (railway.app)
- Git установлен

### 2. Первый раз через UI Railway

1. Открыть [Railway.app](https://railway.app)
2. Нажать "Start a New Project"
3. Выбрать "Deploy from GitHub repo"
4. Авторизоваться с GitHub
5. Выбрать репозиторий `DyplomVadymDymov`
6. Railway автоматически обнаружит `backend/package.json`
7. Настроить переменные окружения:
   ```
   PORT=3001
   NODE_ENV=production
   DB_PATH=./data/tracker.db
   SYNC_CONFLICT_STRATEGY=last-write-wins
   CORS_ORIGIN=https://your-frontend-domain.com
   LOG_LEVEL=info
   ```
8. Нажать Deploy
9. После успешного deploy получите URL: `https://finansowy-tracker-production.up.railway.app`

### 3. Автоматические обновления

Railway автоматически будет:
- Слушать изменения в GitHub `main` ветке
- Пересобирать и перезапускать приложение
- Сохранять данные в persistent volume (база данных)

### 4. Проверка статуса

```bash
# Проверить что сервер живой
curl https://finansowy-tracker-production.up.railway.app/health

# Ожидаемый ответ:
# {
#   "success": true,
#   "status": "healthy",
#   "service": "finansowy-tracker-backend",
#   "version": "2.0.0"
# }
```

### 5. Просмотр логов

1. Открыть Railway dashboard
2. Выбрать проект "finansowy-tracker"
3. Выбрать сервис "backend"
4. Открыть tab "Logs"

---

## 📱 Frontend Deployment

### Option 1: Expo Go (для тестирования)

```bash
cd finansowy-tracker
npm install
npx expo start

# Откроется интерактивное меню
# Отсканировать QR code с Expo Go приложением
```

### Option 2: Expo EAS Build (для production)

```bash
# Установить EAS CLI
npm install -g eas-cli

# Авторизоваться
eas login

# Собрать для iOS
eas build --platform ios

# Собрать для Android
eas build --platform android

# Собрать для Web
eas build --platform web
```

### Option 3: React Native Web (простой способ)

```bash
cd finansowy-tracker

# Build for production
npm run build:web

# Будет создана папка build/ которую можно хостить на:
# - Vercel
# - Netlify
# - Firebase Hosting
# - GitHub Pages

# Пример развертывания на Vercel:
npm install -g vercel
vercel --prod ./build
```

---

## 🔗 Обновление Frontend конфигурации

После развертывания backend, обновите URL в frontend:

**Файл:** `finansowy-tracker/src/services/SyncService.js`

```javascript
const API_BASE_URL = 'https://finansowy-tracker-production.up.railway.app/api';
```

**Файл:** `finansowy-tracker/src/services/AnalyticsService.js`

```javascript
const API_BASE_URL = 'https://finansowy-tracker-production.up.railway.app/api';
```

После изменения:

```bash
git add .
git commit -m "chore: Update backend API URL to production"
git push origin main
```

Railway автоматически пересоберет фронтенд с новым URL.

---

## 🔐 Security Checklist

- [ ] Переменная `NODE_ENV` установлена в `production`
- [ ] `CORS_ORIGIN` установлена на конкретный домен (не *)
- [ ] База данных регулярно backup'ится (Railway делает это автоматически)
- [ ] Логи не содержат чувствительных данных
- [ ] Все input валидируется на backend
- [ ] Пароли/ключи не в git (используются .env переменные)
- [ ] HTTPS используется везде

---

## 📊 Мониторинг

### Railway Monitoring

Railway предоставляет встроенные инструменты:
- Response time graphs
- Error rate tracking
- Resource usage (CPU, memory)
- Deployment history

### Custom Monitoring

```bash
# Периодически проверить здоровье
curl -s https://finansowy-tracker-production.up.railway.app/health | jq '.status'
```

---

## 🐛 Troubleshooting

### Problem: Build fails on Railway

**Решение:**
1. Проверить что `package.json` в корне backend папки
2. Убедиться что все dependencies установлены
3. Проверить логи в Railway dashboard
4. Если нужно, добавить `buildScript` в `package.json`

### Problem: Database не сохраняется

**Решение:**
- Railway автоматически создает persistent volume
- По умолчанию хранится в `/app/data/tracker.db`
- Если нужен backup, скачайте файл через Railway dashboard

### Problem: CORS ошибки

**Решение:**
1. Проверить что `CORS_ORIGIN` правильно установлена
2. Убедиться что frontend отправляет правильные headers
3. Перезагрузить backend: `eas update`

### Problem: API отвечает 500 ошибкой

**Решение:**
1. Проверить логи в Railway
2. Убедиться что база данных инициализирована
3. Проверить что запрос содержит корректный `x-user-id` header

---

## 📋 Deployment Checklist

Before going live:

- [ ] Все tests passed локально
- [ ] Backend deploy успешен
- [ ] Health check работает
- [ ] Frontend подключена к production backend
- [ ] Все 3 языка работают
- [ ] Синхронизация работает
- [ ] Аналитика считает правильно
- [ ] Error handling работает
- [ ] No console errors/warnings
- [ ] Документация актуальна

---

## 📞 Support

For Railway issues:
- Railway docs: https://docs.railway.app
- Railway status: https://status.railway.app

For code issues:
- See GitHub Issues: https://github.com/AniSary/DyplomVadymDymov

---

## 🔄 Post-Deployment

1. **Tell users the new URL:**
   ```
   Backend: https://finansowy-tracker-production.up.railway.app
   ```

2. **Update any documentation** with new URLs

3. **Test all features** on production environment

4. **Monitor for issues** in first week

5. **Set up monitoring alerts** (optional through Railway)
