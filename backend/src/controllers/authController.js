const authService = require('../services/authService');

// @desc    Zarejestruj użytkownika
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "Użytkownik zarejestrowany pomyślnie!"
        });
    } catch (err) {
        // Błąd 400 jeśli user istnieje lub dane są błędne
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Zaloguj użytkownika
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.authenticateUser(email, password);

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (err) {
        // Obsługa statusów zależnie od typu błędu
        const status = err.message === "Nie znaleziono użytkownika" ? 404 : 401;
        res.status(status).json({ success: false, message: err.message });
    }
};