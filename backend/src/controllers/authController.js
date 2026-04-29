const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Sprawdź czy użytkownik istnieje
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Użytkownik o tym mailu już istnieje" });

        // Tworzenie użytkownika (password zostanie zahashowane w modelu User.js)
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ZMIANA: Dodano .select('+password'), ponieważ w modelu ustawiliśmy select: false
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ message: "Nie ma takiego użytkownika" });

        // ZMIANA: Użycie metody z modelu User do porównania haseł
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Błędne hasło" });

        // Generuj token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

