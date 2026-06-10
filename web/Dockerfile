FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Vite domyślnie odpala się na porcie 5173
EXPOSE 5173

# Uruchomienie deweloperskie Vite z flagą --host,
# aby port był dostępny poza kontenerem
CMD ["npm", "run", "dev", "--", "--host"]