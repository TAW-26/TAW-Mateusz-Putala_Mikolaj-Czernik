const User = require('../models/User');
const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint'); // Import konieczny do czyszczenia przystanków

// @desc    Aktualizacja profilu zalogowanego użytkownika
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        // Pobieramy dane z body, które chcemy pozwolić edytować
        const fieldsToUpdate = {
            username: req.body.username,
            email: req.body.email,
            preferences: req.body.preferences
        };

        // Usuwamy z obiektu pola, które są undefined (użytkownik ich nie wysłał)
        Object.keys(fieldsToUpdate).forEach(
            key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,           // Zwróć zaktualizowany dokument
            runValidators: true  // Uruchom walidację modelu (np. czy email jest poprawny)
        }).select('-password'); // Nie zwracaj hasła w odpowiedzi

        res.status(200).json({
            success: true,
            message: "Profil został pomyślnie zaktualizowany",
            data: user
        });
    } catch (err) {
        // Jeśli np. email już istnieje w bazie, Mongoose wyrzuci błąd, który tu złapiemy
        res.status(400).json({ success: false, error: err.message });
    }
};


// @desc    Usuwanie użytkownika (Kaskadowe: Waypoints -> Trips -> User)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Nie znaleziono użytkownika" });
        }

        // Zabezpieczenie Super Admina
        if (user.email === 'superadmin@voyager.pl') {
            return res.status(403).json({
                success: false,
                message: "Nie można usunąć głównego konta administratora!"
            });
        }

        // --- START KASKADY ---

        // 1. Znajdź ID wszystkich wycieczek należących do tego użytkownika
        const userTrips = await Trip.find({ user: req.params.id });
        const tripIds = userTrips.map(trip => trip._id);

        // 2. Usuń wszystkie waypointy powiązane z tymi wycieczkami
        if (tripIds.length > 0) {
            await Waypoint.deleteMany({ trip: { $in: tripIds } });
        }

        // 3. Usuń wszystkie wycieczki tego użytkownika
        await Trip.deleteMany({ user: req.params.id });

        // 4. Usuń samego użytkownika
        await User.findByIdAndDelete(req.params.id);

        // --- KONIEC KASKADY ---

        res.status(200).json({
            success: true,
            message: "Użytkownik oraz wszystkie powiązane wycieczki i punkty trasy zostały usunięte"
        });
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

// @desc    Pobranie listy wszystkich użytkowników
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
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