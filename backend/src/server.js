const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes');
const { protect } = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');

// Konfiguracja środowiska i bazy danych
// Upewnij się, że plik .env jest w folderze głównym backend/
dotenv.config();
connectDB();

const app = express();

// Middleware globalne
app.use(cors());
app.use(express.json());

// Definicje tras
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);

// Chroniona trasa profilu (dowód działania systemu autoryzacji)
app.get('/api/auth/profile', protect, (req, res) => {
    res.json({
        success: true,
        message: "Dostęp do profilu przyznany! 🛡️",
        user: req.user // Teraz dzięki poprawce w protect, req.user zawiera też rolę!
    });
});

// Podstawowy endpoint sprawdzający stan serwera
app.get('/', (req, res) => {
    res.send('API Voyager śmiga! 🚀');
});

// Middleware do obsługi błędów
app.use(errorHandler);

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🌍 Serwer śmiga na porcie ${PORT}`);
});