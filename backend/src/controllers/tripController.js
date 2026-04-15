const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint');
const aiService = require('../services/aiService');
const User = require('../models/User');

// @desc    Utwórz nową wycieczkę (A -> B) - obsługuje aiSettings z automatu
exports.createTrip = async (req, res) => {
    try {
        const trip = await Trip.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json({ success: true, data: trip });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Pobierz wycieczki usera wraz z posortowanymi przystankami
exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id })
            .populate({
                path: 'waypoints',
                options: { sort: { 'order_index': 1 } }
            })
            .sort('-createdAt');
        res.status(200).json({ success: true, count: trips.length, data: trips });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
};

// @desc    Pobierz pojedynczą wycieczkę (szczegóły trasy A -> B)
exports.getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate({
            path: 'waypoints',
            options: { sort: { 'order_index': 1 } }
        });

        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Aktualizuj wycieczkę (w tym suwaki aiSettings)
exports.updateTrip = async (req, res) => {
    try {
        let trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        // Weryfikacja uprawnień
        if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Usuń wycieczkę (KASKADOWO: usuwa też wszystkie waypointy tej wycieczki)
exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        await Waypoint.deleteMany({ trip: req.params.id });
        await trip.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Wycieczka oraz wszystkie jej punkty zostały pomyślnie usunięte'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- LOGIKA WAYPOINTS (PRZYSTANKÓW) ---

exports.getWaypointsByTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        const waypoints = await Waypoint.find({ trip: req.params.tripId }).sort('order_index');
        res.status(200).json({ success: true, data: waypoints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addWaypoint = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        const waypoint = await Waypoint.create({
            ...req.body,
            trip: req.params.tripId
        });
        res.status(201).json({ success: true, data: waypoint });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateWaypoint = async (req, res) => {
    try {
        let waypoint = await Waypoint.findById(req.params.id).populate('trip');
        if (!waypoint) return res.status(404).json({ message: 'Punkt nie istnieje' });

        if (waypoint.trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        waypoint = await Waypoint.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: waypoint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteWaypoint = async (req, res) => {
    try {
        const waypoint = await Waypoint.findById(req.params.id).populate('trip');
        if (!waypoint) return res.status(404).json({ message: 'Punkt nie istnieje' });

        if (waypoint.trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        await waypoint.deleteOne();
        res.status(200).json({ success: true, message: 'Punkt usunięty' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAllWaypoints = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        if (trip.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Brak uprawnień' });
        }

        await Waypoint.deleteMany({ trip: req.params.tripId });

        res.status(200).json({
            success: true,
            message: 'Wszystkie punkty trasy zostały usunięte'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTripsAdmin = async (req, res) => {
    try {
        const trips = await Trip.find().populate('user', 'username email');
        res.status(200).json({ success: true, count: trips.length, data: trips });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllWaypointsAdmin = async (req, res) => {
    try {
        const waypoints = await Waypoint.find().populate('trip', 'title');
        res.status(200).json({
            success: true,
            count: waypoints.length,
            data: waypoints
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.generateAITrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!trip) return res.status(404).json({ message: "Nie znaleziono wycieczki" });

        // Wywołanie AI
        const suggestedPoints = await aiService.generateWaypoints(trip, user);

        // Wyczyszczenie starych punktów, jeśli istniały
        await Waypoint.deleteMany({ trip: trip._id });

        // Zapisanie nowych punktów do bazy
        const createdWaypoints = await Promise.all(suggestedPoints.map(point => {
            return Waypoint.create({
                ...point,
                trip: trip._id
            });
        }));

        res.status(200).json({
            success: true,
            message: "AI wygenerowało trasę pomyślnie",
            data: createdWaypoints
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "AI nie mogło wygenerować trasy. Spróbuj ponownie." });
    }
};