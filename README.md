# Smart Voyager - Inteligentny Planer Podróży AI

Smart Voyager to ekosystem aplikacji (Web + Mobile) rewolucjonizujący planowanie podróży.
Dzięki integracji z modelami LLM (OpenAI/Gemini), system generuje spersonalizowane trasy
na podstawie budżetu i zainteresowań, ale również konkretnych parametrów logistycznych i budżetowych wycieczki.

## 🚀 Stan projektu
Zakończono implementację rdzenia Backendowego oraz infrastruktury DevOps, w tym:
* **Inteligentne Planowanie (AI):** Pełna integracja z Groq API (Llama 3.3). System wykonuje wielowymiarową analizę preferencji użytkownika oraz ustawień wycieczki.
* **Integracja z bazą danych:** Pełna komunikacja z MongoDB Atlas.
* **Autoryzacja i Role (RBAC):** Zaawansowany system ról (User, Admin). Logowanie i rejestracja oparte na JWT oraz szyfrowaniu haseł (bcrypt).
* **Pełny cykl edycji (CRUD):** Możliwość pełnego zarządzania profilami, wycieczkami oraz przystankami (Tworzenie, Odczyt, Aktualizacja, Usuwanie).
* **Zaawansowana Logika Biznesowa:** * CRUD wycieczek z automatycznym wyliczaniem czasu trwania (`virtuals`).
    * Obsługa przystanków (**Waypoints**) z zachowaniem kolejności (`order_index`).
    * **Kaskadowe Usuwanie:** Usunięcie użytkownika lub wycieczki automatycznie czyści wszystkie powiązane dane (User -> Trips -> Waypoints).
* **Infrastruktura i Monitoring (DevOps):**
    * Pełna konteneryzacja całego stosu technologicznego (Web, Backend, MongoDB, Prometheus).
    * Wdrożenie niezależnego zbierania metryk systemowych i aplikacyjnych za pomocą `prom-client` oraz serwera **Prometheus**.
    * Implementacja ustrukturyzowanego middleware do logowania błędów serwera (timestamp, typ, kontekst sieciowy).
    * Przygotowanie skryptów wydajnościowych do automatycznych testów stabilności pod obciążeniem (**Grafana k6**).

## 🛠 Technologie
* **Backend:** Node.js, Express, JWT, MongoDB, Mongoose
* **Infrastruktura & Monitoring:** Docker, Docker Compose, Prometheus, Grafana k6
* **Frontend Web:** React, TypeScript, Axios, Vite
* **Frontend Mobile:** React Native (Expo), TypeScript, Zustand
* **AI Integration:** Groq API (Llama 3.3)

## 📡 Backend API (Endpointy)

### Inteligentne Planowanie AI
| Metoda | Endpoint | Opis | Uprawnienia |
| :--- | :--- | :--- | :--- |
| POST | `/api/trips/:id/generate` | Generuje nową trasę (punkty) przy użyciu AI na podstawie preferencji usera | Użytkownik |
| DELETE | `/api/trips/:id/waypoints` | Czyści wszystkie punkty z danej wycieczki | Użytkownik |

### Monitoring i Metryki
| Metoda | Endpoint | Opis | Uprawnienia |
| :--- | :--- | :--- | :--- |
| GET | `/metrics` | Endpoint metryk aplikacyjnych dla systemu Prometheus | Publiczne / Systemowe |

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
* `/web` - Aplikacja webowa (React + Vite)
* `/mobile` - Aplikacja mobilna (React Native + Expo)
* `/backend` - Serwer API (Node.js + Express)
* `/docs` - Dokumentacja projektowa, monitoring oraz schematy UML
* `/tests-load` - Skrypty wydajnościowe i obciążeniowe k6

## ⚙️ Uruchomienie Środowiska (Docker Compose)

Najwygodniejszym sposobem na uruchomienie pełnego ekosystemu (Backend, Frontend Web, Baza danych, Prometheus) jest użycie przygotowanej konfiguracji wielokontenerowej.

### Wymagania wstępne:
* Zainstalowany [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Instrukcja startu:
1. Skonfiguruj plik `.env` w folderze głównym projektu lub w `/backend` (upewnij się, że posiadasz poprawne klucze `GROQ_API_KEY` oraz `JWT_SECRET`).
2. Uruchom terminal w głównym katalogu projektu i wpisz:
   ```bash
   docker compose up --build