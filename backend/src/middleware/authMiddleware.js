const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    // Token zazwyczaj przesyła się w nagłówku Authorization jako 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Weryfikacja tokena
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

            // Dodajemy dane użytkownika z tokena do obiektu req, żeby kontrolery miały do nich dostęp
            req.user = decoded;
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