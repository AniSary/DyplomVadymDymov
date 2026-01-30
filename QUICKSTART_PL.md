# ⚡ Szybki Start (Quick Start)

## 🚀 3 kroki do uruchomienia aplikacji

### Krok 1: Instalacja zależności (1 minuta)

```bash
cd finansowy-tracker
npm install
```

### Krok 2: Uruchomienie serwera (30 sekund)

```bash
npm start
```

### Krok 3: Uruchomienie aplikacji

#### Opcja A: Na fizycznym urządzeniu (Expo Go)

1. Zainstaluj **Expo Go** z App Store / Google Play
2. Zeskanuj kod QR z konsoli
3. Aplikacja załaduje się na twoje urządzenie

#### Opcja B: Na emulatorze

```bash
# Android
npm run android

# iOS (tylko macOS)
npm run ios
```

---

## ✨ Co dalej?

### 📖 Dokumentacja

- **[README.md](./README.md)** - pełne informacje o aplikacji
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - jak korzystać z aplikacji
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - architektura techniczna
- **[EXAMPLES.md](./EXAMPLES.md)** - przykłady kodu dla deweloperów

### 💻 Dla deweloperów

**Struktura projektu:**
```
src/
├── screens/      - 7 głównych ekranów
├── components/   - 11 komponentów UI
├── context/      - zarządzanie stanem
├── services/     - obsługa danych
├── utils/        - funkcje pomocnicze
├── constants/    - stałe aplikacji
└── navigation/   - routing
```

**Główne pliki:**
- `App.js` - komponent główny
- `app.json` - konfiguracja Expo
- `package.json` - zależności

### 🎯 Pierwsze kroki w aplikacji

1. **Otworzy się Splash Screen** (2 sek)
2. **Przejdzie na Dashboard** (ekran główny)
3. **Naciśnij "+ Dodaj transakcję"**
4. **Wybierz wydatek/przychód i dodaj transakcję**
5. **Wyświetl wyniki na kartach**

---

## 🔧 Rozwiązywanie problemów

### Aplikacja nie uruchamia się

```bash
# Czyszczenie cache
rm -rf node_modules package-lock.json
npm install
npm start
```

### Błąd podczas instalacji

```bash
# Instalacja z uprawnieniami administratora
npm install --legacy-peer-deps
```

### Dane się nie zapisują

- Sprawdź połączenie internetowe
- Upewnij się, że aplikacja może pisać do pamięci urządzenia
- Uruchom aplikację ponownie

---

## 📱 Wymagania systemowe

- **Node.js:** 14.0+
- **npm:** 6.0+
- **Android:** 5.0+
- **iOS:** 12.0+

---

## 🎓 Badanie kodu

### Punkt wejścia
```javascript
// App.js
<AppProvider>
  <Navigation />
</AppProvider>
```

### Dodawanie funkcji
```javascript
// 1. Logika: src/services/StorageService.js
// 2. Stan: src/context/AppContext.js
// 3. UI: src/screens/ lub src/components/
// 4. Routing: src/navigation/Navigation.js
```

### Przykład: Dodaj nową kategorię

```javascript
import { useApp } from '../context/AppContext';

const { addCategory } = useApp();

await addCategory({
  name: 'Sport',
  type: 'expense',
  icon: '⚽',
  color: '#FF6B6B'
});
```

---

## 🎨 Dostosowanie

### Zmień kolor motywu

```javascript
// src/constants/colors.js
export const lightTheme = {
  primary: '#2E7D32', // Zmień tutaj
  // ...
};
```

### Dodaj nową walutę

```javascript
// src/constants/currencies.js
export const CURRENCIES = {
  // ...
  NEW: { code: 'NEW', symbol: '💱', name: 'Nowa waluta' }
};
```

---

## 📊 Statystyka projektu

- **Rozmiar:** ~50 KB (kod minimalny)
- **Komponentów:** 11
- **Ekranów:** 7
- **Linii kodu:** ~2500
- **Funkcji:** 50+
- **Metod API:** 30+

---

## 🚀 Następne kroki

- [x] Utwórz główną aplikację
- [x] Dodaj wszystkie ekrany
- [x] Wdróż lokalne przechowywanie
- [ ] Dodaj synchronizację z chmurą (przyszłość)
- [ ] Dodaj ciemny motyw (gotowy w kodzie)
- [ ] Dodaj więcej wykresów
- [ ] Dodaj powiadomienia
- [ ] Opublikuj w App Store / Google Play

---

**Gotowe! Aplikacja jest w pełni funkcjonalna. Zacznij używać lub dalej rozwijaj! 🎉**
