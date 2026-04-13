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

        // Szukaj użytkownika
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Nie ma takiego użytkownika" });

        // Porównaj hasła
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Błędne hasło" });

        // Generuj token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey', // Pamiętaj dodać JWT_SECRET do .env
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