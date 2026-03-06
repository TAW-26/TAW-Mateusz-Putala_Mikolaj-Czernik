# Inteligentny planer podróży z wykorzystaniem AI

## Realizatorzy
* Mateusz Putała
* Mikołaj Czernik
---

## Opis
Projekt polega na stworzeniu aplikacji webowej wspomagającej planowanie podróży. 
Głównym wyróżnikiem systemu jest integracja z modelem sztucznej inteligencji (AI), 
który na podstawie preferencji użytkownika (budżet, zainteresowania, czas trwania, 
tempo zwiedzania) generuje spersonalizowane plany wycieczek.

Aplikacja będzie pełnić rolę osobistego asystenta podróży, łącząc funkcje mapy, 
kalendarza oraz bazy atrakcji turystycznych. System pozwoli uniknąć ręcznego przeszukiwania setek stron w poszukiwaniu inspiracji, 
oferując gotowy harmonogram dnia wraz z sugerowanymi miejscami do odwiedzenia.

## Zakres funkcjonalny

### Funkcjonalności dla użytkownika niezalogowanego
- Przeglądanie ogólnodostępnych inspiracji podróżniczych i popularnych tras.
- Wyszukiwanie atrakcji turystycznych według lokalizacji.
- Podgląd szczegółów konkretnych miejsc (opisy, zdjęcia).

### Funkcjonalności dla użytkownika zalogowanego
- **Generator planu AI:** Formularz preferencji (miejsce, data, budżet, styl: "aktywny" vs "relaks") przesyłany do modelu AI.
- **Inteligentny routing "A do B":** Planowanie trasy przejazdu między dwoma punktami z uwzględnieniem "ciekawych przystanków" (zabytki, punkty widokowe) zamiast najkrótszej drogi.
- **Wirtualny przewodnik AI:** Funkcja asystenta głosowego, który w trakcie podróży (na podstawie lokalizacji GPS) opowiada o zbliżających się atrakcjach i historii mijanych miejsc.
- **Zarządzanie podróżami:** Tworzenie własnych planów, edycja wygenerowanych tras (dodawanie/usuwanie punktów).
- **Zapisywanie ulubionych miejsc:** Tworzenie listy "bucket list" do przyszłych podróży.

### Funkcjonalności administracyjne
- Moderacja bazy atrakcji i zdjęć.
- Zarządzanie kontami użytkowników.
- Monitorowanie limitów zapytań do API (np. OpenAI/Gemini API).

---

## Proponowane technologie

| Warstwa | Technologia |
|---|---|
| **Frontend** | React / Angular |
| **Backend** | Node.js (Express) |
| **Baza danych** | MongoDB |
| **Integracja AI** | OpenAI API / Gemini API |
| **Autentykacja** | JWT (JSON Web Token) |
| **Narzędzia** | Git, IntelliJ IDEA, Docker |