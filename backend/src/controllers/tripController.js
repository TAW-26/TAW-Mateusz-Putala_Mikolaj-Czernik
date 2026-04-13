const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint'); // Dodano import modelu Waypoint

// @desc    Utwórz nową wycieczkę
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

// @desc    Pobierz wycieczki zalogowanego użytkownika
exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id })
            .populate('waypoints')
            .sort('-createdAt');
        res.status(200).json({ success: true, count: trips.length, data: trips });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Błąd serwera' });
    }
};

// @desc    Usuń wycieczkę (z weryfikacją właściciela)
exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) return res.status(404).json({ message: 'Nie znaleziono wycieczki' });

        // Sprawdzenie czy użytkownik jest właścicielem
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Brak uprawnień do usunięcia tej wycieczki' });
        }

        await trip.deleteOne();
        res.status(200).json({ success: true, message: 'Wycieczka usunięta' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Dodaj punkt trasy do wycieczki (implementacja relacji z diagramu UML)
exports.addWaypoint = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Nie znaleziono wycieczki' });
        }

        // Weryfikacja, czy użytkownik dodaje punkt do własnej wycieczki
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Brak uprawnień do edycji tej wycieczki' });
        }

        const waypoint = await Waypoint.create({
            ...req.body,
            trip: req.params.tripId
        });

        res.status(201).json({ success: true, data: waypoint });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};