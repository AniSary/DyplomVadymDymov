# 🚀 Instrukcja uruchomienia i użytkowania

## Szybki start

### 1️⃣ Instalacja zależności

```bash
# Przejdź do folderu projektu
cd finansowy-tracker

# Zainstaluj zależności
npm install
```

### 2️⃣ Uruchomienie aplikacji

#### Na urządzeniu (Expo Go)

```bash
# Uruchom serwer Expo
npm start

# W konsoli wybierz opcję:
# 'a' - uruchom na Androidzie (jeśli emulator jest zainstalowany)
# 'i' - uruchom na iOS (tylko macOS)
# lub zeskanuj kod QR aplikacją Expo Go
```

#### Na emulatorze Android

```bash
npm run android
```

#### Na emulatorze iOS (macOS)

```bash
npm run ios
```

#### W przeglądarce

```bash
npm run web
```

## 📖 Użytkowanie aplikacji

### Pierwsze uruchomienie

1. Pojawi się ekran Splash Screen (ok. 2 sek.)
2. Otworzy się Dashboard z trybem pustego stanu
3. Kategorie zostaną załadowane domyślnie

### Podstawowy proces pracy

#### 1. Dodawanie transakcji

1. Naciśnij przycisk **"+ Dodaj operację"** na ekranie głównym lub w zakładce "Operacje"
2. Wybierz typ: przychód lub wydatek
3. Wprowadź kwotę, kategorię, datę i opcjonalny komentarz
4. Zapisz transakcję

#### 2. Edycja i usuwanie

- Edytuj istniejącą transakcję, klikając ją na liście i wybierając opcję edycji
- Usuń transakcję za pomocą przycisku usuwania w widoku szczegółów

#### 3. Kategorie

- Zarządzaj kategoriami w zakładce "Kategorie"
- Dodawaj nowe kategorie, wybieraj emoji i kolor
- Usuwaj kategorie, jeśli nie są używane

---

## 🔧 Rozwiązywanie problemów

- Jeśli aplikacja nie wczytuje danych, sprawdź logi w konsoli
- W razie problemów z AsyncStorage, spróbuj zresetować dane

---

Jeśli chcesz, mogę dopracować tłumaczenie, zaktualizować linki wewnętrzne lub stworzyć pełne nadpisanie oryginalnych plików (zamiana plików .md).