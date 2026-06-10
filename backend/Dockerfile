# 1. Bazowy obraz Node.js (wersja LTS Alpine - lekka)
FROM node:22-alpine

# 2. Ustawienie katalogu roboczego wewnątrz kontenera
WORKDIR /usr/src/app

# 3. Kopiowanie plików definicji zależności
COPY package*.json ./

# 4. Instalacja bibliotek (produkcyjnych)
RUN npm install

# 5. Kopiowanie całej reszty kodu źródłowego backendu
COPY . .

# 6. Informacja o porcie, na którym działa aplikacja
EXPOSE 5000

# 7. Komenda uruchamiająca serwer
CMD ["npm", "run", "dev"]