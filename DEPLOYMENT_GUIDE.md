# Build & APK Generation Guide

Полный гайд для сборки приложения в APK и запуска локально.

## 🚀 Быстрый старт (локальный)

### Backend

```bash
cd backend
npm install
npm start

# Сервер запустится на http://localhost:3001
# Проверить: curl http://localhost:3001/health
```

### Frontend - Web

```bash
cd finansowy-tracker
npm install
npm start

# Выбрать 'w' для Web версии
# Откроется на http://localhost:8081
```

### Frontend - iOS (на Mac)

```bash
cd finansowy-tracker
npm install
npx expo start

# Выбрать 'i' для iOS
# Откроется iOS Simulator
```

### Frontend - Android

```bash
cd finansowy-tracker
npm install
npx expo start

# Выбрать 'a' для Android
# Откроется Android Emulator
```

---

## 📦 APK Generation (Production Build)

### Требования

- **Android Studio** или **Android SDK** установлены
- **Java JDK** >= 11
- **Node.js** >= 18

### Способ 1: Через EAS Build (рекомендуется)

```bash
# 1. Установить EAS CLI
npm install -g eas-cli

# 2. Авторизоваться (нужен аккаунт на Expo)
eas login

# 3. Инициализировать EAS в проекте
cd finansowy-tracker
eas build:configure

# 4. Собрать APK для Android
eas build --platform android --local

# 5. Скачать APK
# После завершения получите ссылку на download

# 6. Установить на устройство/эмулятор
adb install ./app-release.apk
```

### Способ 2: Локальная сборка через Expo

```bash
cd finansowy-tracker

# Создать производственный билд для Android
eas build --platform android --local

# Или экспортировать для локальной сборки
npx expo prebuild --clean

# Затем собрать через Gradle
cd android
./gradlew assembleRelease
```

### Способ 3: Через React Native CLI

```bash
cd finansowy-tracker

# Генерировать Android проект
npx react-native init FinansowyTracker --version 0.73

# Собрать APK
cd android
./gradlew assembleRelease

# APK будет в: app/build/outputs/apk/release/app-release.apk
```

---

## 🔧 Конфигурация для Build

### app.json (финансово-tracker)

```json
{
  "expo": {
    "name": "Finansowy Tracker",
    "slug": "finansowy-tracker",
    "version": "2.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.finansowytracker.app"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 21,
            "targetSdkVersion": 33,
            "compileSdkVersion": 33
          }
        }
      ]
    ]
  }
}
```

---

## 📱 Установка APK на устройство

### На Android Emulator

```bash
# 1. Запустить эмулятор
emulator -avd Nexus_5_API_30

# 2. Установить APK
adb install finansowy-tracker.apk

# 3. Запустить
adb shell am start -n com.finansowytracker.app/.MainActivity
```

### На физическом Android устройстве

```bash
# 1. Включить USB Debug Mode на устройстве
# Settings > Developer Options > USB Debugging

# 2. Подключить устройство к компьютеру
adb devices

# 3. Установить APK
adb install finansowy-tracker.apk
```

---

## 🗄️ Локальный Backend

Backend работает полностью локально без облачного деплоя:

```bash
cd backend

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env

# Запустить
npm start

# Server будет на http://localhost:3001
```

**База данных хранится локально:** `backend/data/tracker.db`

Приложение автоматически подключится к локальному backend.

---

## ✅ Checklist перед сборкой APK

- [ ] Backend запускается без ошибок
- [ ] Frontend запускается на Web (npm start > w)
- [ ] Нет console errors/warnings
- [ ] Все 3 языка работают
- [ ] Dark/Light theme работают
- [ ] Аналитика считает правильно
- [ ] Синхронизация работает локально
- [ ] API endpoints отвечают правильно
- [ ] Версия в app.json обновлена (package.json синхронизирована)

---

## 📊 Размер APK

Ожидаемые размеры:

- **Debug APK**: ~150-200 MB
- **Release APK**: ~60-80 MB

Release версия значительно меньше благодаря минификации.

---

## 🐛 Troubleshooting

### Problem: Build fails

```bash
# Очистить кэш
npm cache clean --force

# Удалить node_modules
rm -rf node_modules
npm install

# Попробовать заново
eas build --platform android --local
```

### Problem: APK не устанавливается

```bash
# Проверить что Android SDK установлена
adb version

# Проверить что устройство подключено
adb devices

# Установить с флагами
adb install -r finansowy-tracker.apk
```

### Problem: App crashes на старте

1. Проверить что backend запущена на localhost:3001
2. Проверить что база данных инициализирована
3. Проверить logcat: `adb logcat | grep finansowy`

---

## 📋 Файлы для сдачи

Подготовьте следующие файлы:

```
DyplomVadymDymov/
├── backend/                    # Полный backend код
├── finansowy-tracker/          # Полное фронтенд приложение
├── TESTING_GUIDE.md           # Гайд тестирования
├── PROJECT_README.md          # Описание проекта
├── QUICKSTART_GUIDE.md        # Быстрый старт
├── app-release.apk            # Готовый APK (опционально)
└── README.md                  # Главный README
```

---

## 🎯 Сдача проекта

1. **Git repository** - все на GitHub (готово ✅)
2. **Рабочий код** - backend + frontend (готово ✅)
3. **APK** - собрано локально через eas build или gradle
4. **Документация** - TESTING_GUIDE.md + гайды (готово ✅)
5. **Запуск инструкции** - этот файл

Проект полностью готов! 🎉

