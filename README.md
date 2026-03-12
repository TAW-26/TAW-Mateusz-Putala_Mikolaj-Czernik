# Smart Voyager - Inteligentny Planer Podróży AI

Smart Voyager to ekosystem aplikacji (Web + Mobile) rewolucjonizujący planowanie podróży. 
Dzięki integracji z modelami LLM (OpenAI/Gemini), system generuje spersonalizowane trasy 
na podstawie budżetu i zainteresowań, a w trakcie podróży pełni rolę asystenta głosowego.

## Technologie
* **Backend:** Node.js, Express, JWT, MongoDB (Atlas)
* **Frontend Web:** React, TypeScript, Axios
* **Frontend Mobile:** React Native (Expo), TypeScript, Zustand, Expo Location, Text-to-Speech
* **AI Integration:** OpenAI API / Gemini API

## Struktura Projektu
* `/web` - Aplikacja webowa (React)
* `/mobile` - Aplikacja mobilna (React Native)
* `/backend` - Serwer API (Node.js)
* `/docs` - Dokumentacja projektowa

## Instalacja i uruchomienie (Środowisko Dev)

### Backend
1. Przejdź do folderu: `cd backend`
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj plik `.env`
4. Uruchom serwer: `npm run dev`

### Frontend Web
1. Przejdź do folderu: `cd web`
2. Zainstaluj zależności: `npm install`
3. Uruchom projekt: `npm start`

### Frontend Mobile
1. Przejdź do folderu: `cd mobile`
2. Zainstaluj zależności: `npm install`
3. Uruchom projekt: `npx expo start`

## Dokumentacja
Pełna dokumentacja znajduje się w folderze `/docs`.