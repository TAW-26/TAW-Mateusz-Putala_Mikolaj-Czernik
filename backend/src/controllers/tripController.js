const Trip = require('../models/Trip');

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
        const trips = await Trip.find({ user: req.user.id }).sort('-createdAt');
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