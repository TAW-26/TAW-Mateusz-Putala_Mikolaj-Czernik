# Smart Voyager - Inteligentny Planer Podróży AI

Smart Voyager to ekosystem aplikacji (Web + Mobile) rewolucjonizujący planowanie podróży.
Dzięki integracji z modelami LLM (OpenAI/Gemini), system generuje spersonalizowane trasy
na podstawie budżetu i zainteresowań, a w trakcie podróży pełni rolę asystenta głosowego.

## 🚀 Stan projektu
Zakończono implementację rdzenia Backendowego, w tym:
* **Integracja z bazą danych:** Pełna komunikacja z MongoDB Atlas.
* **Autoryzacja i Role (RBAC):** Zaawansowany system ról (User, Admin). Logowanie i rejestracja oparte na JWT oraz szyfrowaniu haseł (bcrypt).
* **Pełny cykl edycji (CRUD):** Możliwość pełnego zarządzania profilami, wycieczkami oraz przystankami (Tworzenie, Odczyt, Aktualizacja, Usuwanie).
* **Zaawansowana Logika Biznesowa:** * CRUD wycieczek z automatycznym wyliczaniem czasu trwania (`virtuals`).
    * Obsługa przystanków (**Waypoints**) z zachowaniem kolejności (`order_index`).
    * **Kaskadowe Usuwanie:** Usunięcie użytkownika lub wycieczki automatycznie czyści wszystkie powiązane dane (User -> Trips -> Waypoints).
* **Panel Administracyjny:** Globalny wgląd w użytkowników, statystyki oraz pełną bazę wszystkich przystanków w systemie.
* **Bezpieczeństwo:** Walidacja danych (express-validator), ochrona tras (Middleware) i weryfikacja uprawnień (właściciel vs admin).

## 🛠 Technologie
* **Backend:** Node.js, Express, JWT, MongoDB (Atlas), Mongoose
* **Walidacja:** Express-Validator
* **Frontend Web:** React, TypeScript, Axios
* **Frontend Mobile:** React Native (Expo), TypeScript, Zustand
* **AI Integration:** OpenAI API / Gemini API (Planowane: generowanie waypointów na trasie)

## 📡 Backend API (Endpointy)
### Uwierzytelnianie i Profil (`/api/auth`)
| Metoda | Endpoint | Opis | Uprawnienia |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Rejestracja nowego użytkownika | Publiczne |
| POST | `/api/auth/login` | Logowanie i zwrot tokena JWT | Publiczne |
| GET | `/api/auth/profile` | Pobranie danych profilu | Użytkownik |
| PUT | `/api/auth/profile` | Aktualizacja danych własnego profilu | Użytkownik |

### Wycieczki (`/api/trips`) - *Wymagają tokena Bearer*
| Metoda | Endpoint | Opis | Uprawnienia |
| :--- | :--- | :--- | :--- |
| GET | `/api/trips` | Pobranie własnych wycieczek z przystankami | Użytkownik |
| GET | `/api/trips/:id` | Szczegóły konkretnej wycieczki | User/Admin |
| POST | `/api/trips` | Utworzenie nowej wycieczki | Użytkownik |
| PUT | `/api/trips/:id` | Edycja danych wycieczki (tytuł, budżet itp.) | User/Admin |
| DELETE | `/api/trips/:id` | Usunięcie wycieczki (Kaskadowo usuwa punkty) | User/Admin |
| GET | `/api/trips/admin/all` | Globalny podgląd wszystkich wycieczek | **Admin** |

### Punkty trasy / Przystanki (`/api/trips/.../waypoints`)
| Metoda | Endpoint | Opis | Uprawnienia |
| :--- | :--- | :--- | :--- |
| GET | `/api/trips/:tripId/waypoints` | Lista przystanków dla danej wycieczki | User/Admin |
| POST | `/api/trips/:tripId/waypoints` | Dodanie przystanku do trasy | Użytkownik |
| PUT | `/api/trips/waypoints/:id` | Aktualizacja punktu (np. visited: true) | Użytkownik |
| DELETE | `/api/trips/waypoints/:id` | Usunięcie pojedynczego punktu | User/Admin |
| GET | `/api/trips/admin/all/waypoints` | Podgląd wszystkich przystanków w systemie | **Admin** |

### Zarządzanie użytkownikami (`/api/users`) - *Tylko dla Administratora*
| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| GET | `/api/users` | Lista wszystkich zarejestrowanych użytkowników |
| GET | `/api/users/stats` | Statystyki (liczba użytkowników i aktywnych wycieczek) |
| PUT | `/api/users/:id/role` | Zmiana uprawnień (User <-> Admin) |
| DELETE | `/api/users/:id` | Usunięcie konta (Kaskadowo usuwa wycieczki i punkty) |

## 📂 Struktura Projektu
* `/web` - Aplikacja webowa (React)
* `/mobile` - Aplikacja mobilna (React Native)
* `/backend` - Serwer API (Node.js)
* `/docs` - Dokumentacja projektowa i schematy UML

## ⚙️ Instalacja i uruchomienie (Środowisko Dev)

### Backend
1. Przejdź do folderu: `cd backend`
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj plik `.env` (`MONGO_URI`, `JWT_SECRET`)
4. Zainicjalizuj konto Administratora: `npm run seed:admin`
    * Domyślne dane: `admin@voyager.pl` / `Haslo123!`
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