# Smart Voyager - Inteligentny Planer Podróży AI

Smart Voyager to ekosystem aplikacji (Web + Mobile) rewolucjonizujący planowanie podróży.
Dzięki integracji z modelami LLM (OpenAI/Gemini), system generuje spersonalizowane trasy
na podstawie budżetu i zainteresowań, a w trakcie podróży pełni rolę asystenta głosowego.

## 🚀 Stan projektu
Zakończono implementację rdzenia Backendowego, w tym:
* **Integracja z bazą danych:** Pełna komunikacja z MongoDB Atlas.
* **Autoryzacja i Role (RBAC):** Zaawansowany system ról (User, Admin). Logowanie i rejestracja oparte na JWT oraz szyfrowaniu haseł (bcrypt).
* **Zarządzanie Użytkownikami:** Panel administracyjny pozwalający na modyfikację uprawnień, przegląd statystyk oraz moderację kont.
* **Logika biznesowa:** CRUD wycieczek z automatycznym wyliczaniem czasu trwania (`virtuals`) oraz implementacja relacyjnych punktów trasy (**Waypoints**).
* **Bezpieczeństwo:** Globalna obsługa błędów, walidacja danych (express-validator) oraz ochrona tras (Middleware) z podziałem na role.

## 🛠 Technologie
* **Backend:** Node.js, Express, JWT, MongoDB (Atlas), Mongoose
* **Frontend Web:** React, TypeScript, Axios
* **Frontend Mobile:** React Native (Expo), TypeScript, Zustand
* **AI Integration:** OpenAI API / Gemini API

## 📡 Backend API (Endpointy)

### Uwierzytelnianie (`/api/auth`)
| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Rejestracja nowego użytkownika |
| POST | `/api/auth/login` | Logowanie i zwrot tokena JWT |
| GET | `/api/auth/profile` | Pobranie danych profilu (wymaga Tokena) |

### Wycieczki (`/api/trips`) - *Wymagają nagłówka Authorization: Bearer <token>*
| Metoda | Endpoint | Opis | Uprawnienia |
| :--- | :--- | :--- | :--- |
| GET | `/api/trips` | Pobranie listy własnych wycieczek | Użytkownik |
| GET | `/api/trips/admin/all` | Globalny podgląd wszystkich wycieczek w systemie | **Admin** |
| POST | `/api/trips` | Dodanie nowej wycieczki (z walidacją budżetu) | Użytkownik |
| DELETE | `/api/trips/:id` | Usunięcie wycieczki (weryfikacja właściciela) | Użytkownik |

### Punkty trasy (`/api/trips/:tripId/waypoints`)
| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| POST | `/api/trips/:tripId/waypoints` | Dodanie punktu (miejsce, współrzędne, opis) do konkretnej wycieczki |

### Zarządzanie użytkownikami (`/api/users`) - *Tylko dla Administratora*
| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| GET | `/api/users` | Pobranie listy wszystkich zarejestrowanych użytkowników |
| GET | `/api/users/stats` | Statystyki systemu (liczba użytkowników, liczba wycieczek) |
| PUT | `/api/users/:id/role` | Zmiana roli użytkownika (np. nadanie uprawnień Admina) |
| DELETE | `/api/users/:id` | Usunięcie konta użytkownika (z blokadą usunięcia Super Admina) |

## 📂 Struktura Projektu
* `/web` - Aplikacja webowa (React)
* `/mobile` - Aplikacja mobilna (React Native)
* `/backend` - Serwer API (Node.js)
* `/docs` - Dokumentacja projektowa

## ⚙️ Instalacja i uruchomienie (Środowisko Dev)

### Backend
1. Przejdź do folderu: `cd backend`
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj plik `.env` (wymagane: `MONGO_URI`, `JWT_SECRET`)
4. Zainicjalizuj konto Administratora (Super Admina): `npm run seed:admin`

   Dane logowania: **superadmin@voyager.pl** / **TajneHaslo123!**

5. Uruchom serwer: `npm run dev`


### Frontend Web
1. Przejdź do folderu: `cd web`
2. Zainstaluj zależności: `npm install`
3. Uruchom projekt: `npm start`

### Frontend Mobile
1. Przejdź do folderu: `cd mobile`
2. Zainstaluj zależności: `npm install`
3. Uruchom projekt: `npx expo start`

## 📄 Dokumentacja
Pełna dokumentacja techniczna oraz schematy bazy danych znajdują się w folderze `/docs`.