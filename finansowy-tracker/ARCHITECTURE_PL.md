# 🏗️ Architektura aplikacji Finansowy Tracker

## 📐 Przegląd architektury

Aplikacja zbudowana jest w podejściu modułowym z wyraźnym podziałem odpowiedzialności:

```
┌─────────────────────────────────────────────┐
│           React Navigation                   │
│  (Nawigacja między ekranami)                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Screens (7 ekranów)               │
│  (Warstwa UI, prezentacja danych)           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Components (11 komponentów)          │
│  (Wielokrotnego użytku elementy UI)         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         AppContext (zarządzanie stanem)     │
│  (Globalny stan aplikacji)                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      Services & Utils (logika aplikacji)    │
│  - StorageService (AsyncStorage)            │
│  - dateUtils (operacje na datach)           │
│  - moneyUtils (operacje finansowe)          │
│  - validation (walidacja danych)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     AsyncStorage (lokalne przechowywanie)   │
│  (Dane na urządzeniu)                       │
└─────────────────────────────────────────────┘
```

## 📂 Struktura katalogów

### `src/screens/` - Ekrany aplikacji

**7 głównych ekranów:**

1. **SplashScreen.js** (Ekran startowy)
   - Wyświetla logo i nazwę
   - Automatyczne przejście do Dashboard
   - Wskaźnik ładowania

2. **DashboardScreen.js** (Główny ekran)
   - Saldo konta
   - Przychody/wydatek miesiąca
   - Największe wydatki według kategorii
   - Ostatnie transakcje

3. **AddTransactionScreen.js** (Dodawanie transakcji)
   - Formularz do dodawania transakcji

... (reszta opisu ekranów i komponentów zachowana analogicznie)

## 🔄 Przepływ danych

- UI wywołuje akcje kontekstu (`AppContext`) do dodawania/edycji/usuwania transakcji
- `AppContext` korzysta z `StorageService` do trwałego zapisu w `AsyncStorage`
- Utylity (`dateUtils`, `moneyUtils`, `validation`) dostarczają pomocniczych funkcji do logiki aplikacji

## 🔒 Zarządzanie stanem

- Globalny stan przechowywany jest w `AppContext` (Context API)
- Metody: dodawanie transakcji, edycja, usuwanie, filtrowanie, inicjalizacja danych

## 🚀 Rozszerzalność

Architektura umożliwia łatwe dodawanie nowych ekranów i funkcji bez znaczących zmian w istniejącej logice.

---

Jeśli chcesz, przetłumaczę też pozostałe pliki dokumentacji i przygotuję pełny zestaw `*_PL.md` lub umieszczę tłumaczenia w katalogu `i18n/pl/` — wybierz preferowaną opcję.