# 🔧 Komendy i narzędzia

## Główne komendy

### Uruchomienie aplikacji

```bash
# Serwer deweloperski
npm start

# Uruchomienie na emulatorze Android
npm run android

# Uruchomienie na symulatorze iOS (tylko macOS)
npm run ios

# Uruchomienie w przeglądarce
npm run web
```

### Instalacja i aktualizacja

```bash
# Instalacja zależności
npm install

# Aktualizacja pakietów
npm update

# Sprawdzenie zainstalowanych pakietów
npm list

# Głębokie czyszczenie
rm -rf node_modules package-lock.json
npm install
```

## Struktura projektu

### Szybki przegląd plików

```bash
# Wszystkie pliki JavaScript
find src -type f -name "*.js"

# Zliczanie plików (PowerShell)
Find src -Filter "*.js" | Measure-Object

# Rozmiar projektu
du -sh .
```

## Praca z Expo

### Instalacja Expo CLI

```bash
# Globalna instalacja
npm install -g expo-cli

# Sprawdzenie wersji
expo --version

# Logowanie do Expo
expo login

# Wylogowanie
expo logout
```

### Debugowanie

```bash
# Pomoc w narzędziach expo
expo send --help

# Podgląd logów
expo logs

# Czyszczenie cache
expo prebuild --clean
```

## Przegląd struktury plików

```bash
# PowerShell (Windows)
Tree src /F

# Linux/Mac
tree src

# Prosty listing
ls -la src/
```

### Tworzenie nowych plików

```bash
# Utworzenie folderu
mkdir src/new-folder

# Utworzenie pliku
touch src/new-folder/NewFile.js
```

## Praca z Git (opcjonalnie)

```bash
# Inicjalizacja repozytorium
git init

# Dodanie wszystkich plików
git add .

# Pierwszy commit
git commit -m "Initial commit: Finansowy Tracker"

# Status repozytorium
git status

# Historia commitów
git log
```

## Testowanie i logi

### Logcat (logi Android)

```bash
# Podgląd logów Android
adb logcat

# Filtrowanie logów
adb logcat | grep "your-app"
```

### Logi w konsoli

```javascript
// W kodzie dodaj
console.log('Debug:', variable);
console.warn('Warning:', message);
console.error('Error:', error);
```

## Wydajność

### Pomiar rozmiaru

```bash
# Analiza bundla web
npm run web -- --analyze

# Rozmiar folderu src
du -sh src/

# Liczba plików
find src -type f | wc -l
```

## Zmienne środowiskowe

### W pliku .env (opcjonalnie)

```env
REACT_NATIVE_DEBUGGER=true
NODE_ENV=development
```

### Użycie w kodzie

```javascript
const apiUrl = process.env.API_URL;
const debugMode = process.env.REACT_NATIVE_DEBUGGER;
```

## Przydatne linki

### Dokumentacja
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev
- React Navigation: https://reactnavigation.org

### Narzędzia
- VS Code: https://code.visualstudio.com
- Android Studio: https://developer.android.com/studio
- Xcode: https://developer.apple.com/xcode

### Rozszerzenia VS Code
```bash
# ES7+ React/Redux/React-Native snippets
code --install-extension dsznajder.es7-react-js-snippets

# React Native Tools
code --install-extension msjsdiag.vscode-react-native

# Prettier - formater kodu
code --install-extension esbenp.prettier-vscode

# ESLint
code --install-extension dbaeumer.vscode-eslint
```

## Optymalizacja

### Czyszczenie cache

```bash
# Wyczyść cache expo
expo prebuild --clean

# Wyczyść cache npm
npm cache clean --force

# Wyczyść cache bundlera
rm -rf .expo/
```

### Optymalizacja kodu

```bash
# Sprawdzenie zależności
npm audit

# Naprawa podatności
npm audit fix

# Usunięcie nieużywanych pakietów
npm prune
```

## Publikacja

### Przygotowanie do publikacji

```bash
# Zaktualizuj wersję w app.json
# Format: X.Y.Z (major.minor.patch)

# Zaktualizuj "version" w package.json
"version": "1.0.0"

# Utwórz produkcyjny build
expo build:android
expo build:ios
```

### Wysyłka do sklepów

```bash
# Google Play Console
# 1. Stwórz projekt
# 2. Załaduj APK z expo-builds/

# Apple App Store
# 1. Stwórz aplikację w App Store Connect
# 2. Załaduj IPA korzystając z Transporter
```

## Przydatne snippet'y

### Dodanie transakcji przez konsolę

```javascript
// W React DevTools Console
const { addTransaction } = useApp();
await addTransaction({
  type: 'expense',
  amount: 100,
  categoryId: '1',
  date: new Date().toISOString(),
  comment: 'Test'
});
```

### Eksport danych przez konsolę

```javascript
const data = await StorageService.exportData();
console.log(JSON.stringify(data, null, 2));
```

### Reset danych przez konsolę

```javascript
await StorageService.resetAllData();
console.log('Dane zresetowane');
```

## Rozwiązywanie problemów

### Aplikacja się zawiesza

```bash
# Zrestartuj emulator
adb devices
adb reboot

# Zabij proces npm
pkill -f "node"

# Uruchom ponownie
npm start
```

### Błędy przy instalacji

```bash
# Instalacja z ignorowaniem konfliktów peer
npm install --legacy-peer-deps

# Czyszczenie i ponowna instalacja
rm -rf node_modules package-lock.json
npm install
```

### Błędy AsyncStorage

```bash
# Ponowna instalacja AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage
```

## Porady dla deweloperów

### Hot reload
- Naciśnij **R** - restart aplikacji
- Naciśnij **D** - otwórz menu deweloperskie
- Naciśnij **I** - otwórz inspector

### Debugger
- Chrome DevTools: http://localhost:19000
- React DevTools: zainstaluj rozszerzenie
- Redux DevTools: zainstaluj rozszerzenie

## Zarządzanie wersjami

### Semantyczne wersjonowanie

```
1.0.0 = Major.Minor.Patch

- Major: Duże zmiany (1.0.0 → 2.0.0)
- Minor: Nowe funkcje (1.0.0 → 1.1.0)
- Patch: Poprawki (1.0.0 → 1.0.1)
```

## Lista kontrolna przed publikacją

- [ ] Wszystkie testy przeszły
- [ ] Brak console.log w kodzie produkcyjnym
- [ ] Zaktualizowana wersja w app.json
- [ ] Zaktualizowana wersja w package.json
- [ ] Dokumentacja aktualna
- [ ] Wszystkie ekrany przetestowane
- [ ] Wszystkie funkcje działają
- [ ] Brak błędów w konsoli
- [ ] Aplikacja zoptymalizowana
- [ ] README aktualne

---

**Ostatnia aktualizacja:** 2024-2025
