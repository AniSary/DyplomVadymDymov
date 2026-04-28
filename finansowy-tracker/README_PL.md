# 💰 Finansowy Tracker

W pełni funkcjonalna aplikacja mobilna do zarządzania finansami osobistymi. Aplikacja działa w pełni offline z lokalnym przechowywaniem danych na urządzeniu.

## 📱 Funkcje

- ✅ **Całkowicie offline** - wszystkie dane są przechowywane lokalnie na urządzeniu
- ✅ **Wieloplatformowa** - działa na iOS i Android
- ✅ **Zarządzanie przychodami i wydatkami** - dodawaj, edytuj i usuwaj transakcje
- ✅ **Kategoryzacja** - twórz i zarządzaj kategoriami przychodów i wydatków
- ✅ **Analizy** - przeglądaj statystyki i wykresy
- ✅ **Wiele walut** - wsparcie dla 7 głównych walut
- ✅ **Elastyczne ustawienia** - wybór motywu, waluty i innych parametrów
- ✅ **Bezpieczeństwo** - wszystkie dane przechowywane lokalnie, nie przesyłane na serwery

## 🏗️ Architektura

### Struktura projektu

```
finansowy-tracker/
├── src/
│   ├── components/        # Wspólne komponenty UI
│   ├── screens/           # Główne ekrany aplikacji
│   ├── context/           # Zarządzanie stanem aplikacji
│   ├── services/          # Serwisy (np. StorageService)
│   ├── utils/             # Pomocnicze funkcje
│   └── constants/         # Stałe (kolory, kategorie, waluty)
├── App.js                 # Komponent główny
├── app.json               # Konfiguracja Expo
├── package.json           # Zależności
└── dokumentacja/          # Pliki README, QUICKSTART itp.
```

## 🚀 Jak uruchomić (szybko)

1. Zainstaluj zależności:

```bash
cd finansowy-tracker
npm install
```

2. Uruchom serwer deweloperski:

```bash
npm start
```

3. Otwórz aplikację na urządzeniu lub emulatorze (Expo Go lub `npm run android` / `npm run ios`).

---

## 📚 Dokumentacja

- **QUICKSTART_PL.md** - szybki start
- **USAGE_GUIDE_PL.md** - instrukcja użytkownika
- **ARCHITECTURE_PL.md** - opis architektury
- **EXAMPLES.md** - przykłady użycia API
- **COMMANDS.md** - przydatne komendy i narzędzia
- **PROJECT_SUMMARY_PL.md** - podsumowanie projektu

---

## 🎯 Główne możliwości

- Dodawanie/edycja/usuwanie operacji
- Zarządzanie kategoriami (domyślnie 14 kategorii)
- Statystyki miesięczne, wykresy i rozkład po kategoriach
- Eksport i import danych w formacie JSON
- Wybór waluty i motywu (jasny/ciemny)

---

## 💻 Stos technologiczny

- React Native + Expo
- React Navigation
- AsyncStorage jako lokalne przechowywanie
- JavaScript (ES6+)

---

Jeśli chcesz, mogę teraz stworzyć wersje polskie pozostałych plików dokumentacji lub zastąpić oryginalne pliki przetłumaczonymi wersjami. Napisz, czy wolisz osobne pliki z sufiksem `_PL` (tak jak zrobiłem) czy zamienić oryginały.
