const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

// Konfiguracja środowiska i bazy danych
dotenv.config();
connectDB();

const app = express();

// Middleware globalne
app.use(cors());
app.use(express.json());

// Definicje tras
app.use('/api/auth', authRoutes);

// Chroniona trasa profilu (dowód działania systemu autoryzacji)
app.get('/api/auth/profile', protect, (req, res) => {
    res.json({
        success: true,
        message: "Dostęp do profilu przyznany! 🛡️",
        user: req.user
    });
});

// Podstawowy endpoint sprawdzający stan serwera
app.get('/', (req, res) => {
    res.send('API Voyager śmiga! 🚀');
});

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🌍 Serwer śmiga na porcie ${PORT}`);
});