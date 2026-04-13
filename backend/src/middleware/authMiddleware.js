const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Dodano import modelu User

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

            // ZMIANA: Pobieramy użytkownika z bazy po ID z tokena, wykluczając hasło.
            // Dzięki temu req.user będzie zawierało pole .role potrzebne dla roleMiddleware.
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Użytkownik już nie istnieje' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Brak autoryzacji, błędny token' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Brak autoryzacji, brak tokena' });
    }
};

module.exports = { protect };