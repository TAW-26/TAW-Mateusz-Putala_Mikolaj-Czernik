# Smart Voyager - Inteligentny Planer Podróży AI

Smart Voyager to ekosystem aplikacji (Web + Mobile) rewolucjonizujący planowanie podróży.
Dzięki integracji z modelami LLM (OpenAI/Gemini), system generuje spersonalizowane trasy
na podstawie budżetu i zainteresowań, a w trakcie podróży pełni rolę asystenta głosowego.

## 🚀 Stan projektu
Zakończono implementację rdzenia Backendowego, w tym:
* **Integracja z bazą danych:** Pełna komunikacja z MongoDB Atlas.
* **Autoryzacja:** System logowania i rejestracji oparty na JWT (JSON Web Token) oraz szyfrowaniu haseł (bcrypt).
* **Logika biznesowa:** CRUD wycieczek z automatycznym wyliczaniem czasu trwania (`virtuals`) oraz implementacja relacyjnych punktów trasy (**Waypoints**).
* **Bezpieczeństwo:** Globalna obsługa błędów (middleware) oraz ochrona tras przed nieautoryzowanym dostępem.

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
| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| GET | `/api/trips` | Pobranie listy wycieczek wraz z przypisanymi punktami (Waypoints) |
| POST | `/api/trips` | Dodanie nowej wycieczki (z walidacją budżetu i pól) |
| DELETE | `/api/trips/:id` | Usunięcie wycieczki (z weryfikacją właściciela) |

### Punkty trasy (`/api/trips/:tripId/waypoints`)
| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| POST | `/api/trips/:tripId/waypoints` | Dodanie punktu (miejsce, współrzędne, opis) do konkretnej wycieczki |

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
4. Uruchom serwer: `npm run dev`

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