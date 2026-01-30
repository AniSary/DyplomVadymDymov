#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Skrypt do tłumaczenia wszystkich plików dokumentacji z rosyjskiego na polski"""

import os
import json

# Słownik tłumaczeń kluczowych terminów
translations = {
    "Финансово Трекер": "Finansowy Tracker",
    "приложение": "aplikacja",
    "операция": "transakcja",
    "операции": "transakcje",
    "экран": "ekran",
    "экраны": "ekrany",
    "категория": "kategoria",
    "категории": "kategorie",
    "компонент": "komponent",
    "компоненты": "komponenty",
    "услуга": "usługa",
    "утилита": "narzędzie",
    "утилиты": "narzędzia",
    "константы": "stałe",
    "навигация": "nawigacja",
    "контекст": "kontekst",
    "состояние": "stan",
    "хранилище": "przechowywanie",
    "данные": "dane",
    "валидация": "walidacja",
    "ошибка": "błąd",
    "документация": "dokumentacja",
    "архитектура": "architektura",
    "структура": "struktura",
    "проект": "projekt",
    "Проект": "Projekt",
    "ПРОЕКТ": "PROJEKT",
    "экспорт": "eksport",
    "импорт": "import",
    "сброс": "reset",
    "настройка": "ustawienie",
    "настройки": "ustawienia",
    "валюта": "waluta",
    "валюты": "waluty",
    "доход": "przychód",
    "доходы": "przychody",
    "расход": "wydatek",
    "расходы": "wydatki",
    "статистика": "statystyka",
    "статистики": "statystyki",
}

print("Skrypt do tłumaczenia będzie wykonany z poziomu edytora...")
