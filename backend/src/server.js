const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pozwala serwerowi rozumieć format JSON

// Połączenie z bazą danych
connectDB();

// Podstawowy testowy punkt (route)
app.get('/', (req, res) => {
    res.send('API Smart Voyager działa poprawnie!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🌍 Serwer śmiga na porcie ${PORT}`);
});