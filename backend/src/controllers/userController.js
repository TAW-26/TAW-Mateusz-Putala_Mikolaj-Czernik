const User = require('../models/User');

// @desc    Usuwanie użytkownika
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Nie znaleziono użytkownika" });
        }

        // Zabezpieczenie Super Admina przed usunięciem
        if (user.email === 'superadmin@voyager.pl') {
            return res.status(403).json({
                success: false,
                message: "Nie można usunąć głównego konta administratora!"
            });
        }

        // Używamy deleteOne lub findByIdAndDelete zamiast remove() (nowsza składnia Mongoose)
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Użytkownik usunięty pomyślnie" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Tutaj w przyszłości dodasz np. getAllUsers dla Admina