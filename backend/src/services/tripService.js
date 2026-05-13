const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint');
const aiService = require('./aiService');

/**
 * Logika generowania punktów przez AI i zapisu do bazy
 */
exports.generateAndSaveAIWaypoints = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw new Error("Nie znaleziono wycieczki");

    // 1. Wywołanie Twojego poprawionego aiService
    const suggestedPoints = await aiService.generateWaypoints(trip, user);

    // 2. Czyszczenie starych punktów
    await Waypoint.deleteMany({ trip: trip._id });

    // 3. Zapis nowych punktów
    const createdWaypoints = await Promise.all(suggestedPoints.map(point => {
        return Waypoint.create({
            ...point,
            trip: trip._id
        });
    }));

    // 4. Aktualizacja listy ID w modelu Trip
    trip.waypoints = createdWaypoints.map(w => w._id);
    await trip.save();

    return createdWaypoints;
};

/**
 * Logika usuwania wycieczki (KASKADA)
 */
exports.deleteTripCascade = async (tripId) => {
    await Waypoint.deleteMany({ trip: tripId });
    return await Trip.findByIdAndDelete(tripId);
};