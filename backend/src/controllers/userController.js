const User = require('../models/User');
const Trip = require('../models/Trip');

// @desc    Usuwanie użytkownika
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Nie znaleziono użytkownika" });
        }

        if (user.email === 'superadmin@voyager.pl') {
            return res.status(403).json({
                success: false,
                message: "Nie można usunąć głównego konta administratora!"
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Użytkownik usunięty pomyślnie" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Pobranie statystyk systemu (Dashboard)
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const tripCount = await Trip.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalUsers: userCount,
                totalTrips: tripCount,
                serverStatus: "Online",
                lastChecked: new Date().toLocaleString('pl-PL')
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Zmiana roli użytkownika
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: "Niepoprawna rola" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Nie znaleziono użytkownika" });
        }

        if (user.email === 'superadmin@voyager.pl') {
            return res.status(403).json({ success: false, message: "Nie można zmienić roli głównego administratora!" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Rola użytkownika ${user.username} zmieniona na ${role}`,
            data: user
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- NOWA FUNKCJA ---

// @desc    Pobranie listy wszystkich użytkowników
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        // .select('-password') sprawia, że pole password nie zostanie wysłane
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
