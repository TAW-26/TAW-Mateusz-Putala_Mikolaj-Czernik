const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint');
const aiService = require('./aiService');

/**
 * Weryfikacja praw własności do zasobu (Trip lub Waypoint)
 * Sprawdza, czy użytkownik jest właścicielem lub posiada rolę admina
 */
const checkOwnership = (resource, user) => {
    if (!resource) throw new Error('Nie znaleziono zasobu');

    // Waypoint po populate('trip') ma strukturę resource.trip.user
    const ownerId = resource.user ? resource.user.toString() : resource.trip?.user?.toString();

    if (ownerId !== user.id && user.role !== 'admin') {
        throw new Error('Brak uprawnień');
    }
};

/**
 * Pobieranie wszystkich wycieczek konkretnego użytkownika
 */
exports.getUserTrips = async (userId) => {
    return await Trip.find({ user: userId })
        .populate({ path: 'waypoints', options: { sort: { 'order_index': 1 } } })
        .sort('-createdAt');
};

/**
 * Pobieranie szczegółów pojedynczej wycieczki wraz z autoryzacją dostępu
 */
exports.getSingleTrip = async (tripId, user) => {
    const trip = await Trip.findById(tripId).populate({
        path: 'waypoints',
        options: { sort: { 'order_index': 1 } }
    });
    checkOwnership(trip, user);
    return trip;
};

/**
 * Tworzenie nowej wycieczki w bazie danych
 */
exports.createSmartTrip = async (tripData, userId) => {
    return await Trip.create({ ...tripData, user: userId });
};

/**
 * Aktualizacja danych wycieczki z weryfikacją uprawnień
 */
exports.updateTripData = async (tripId, updateData, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Trip.findByIdAndUpdate(tripId, updateData, { new: true, runValidators: true });
};

/**
 * Kaskadowe usuwanie wycieczki (najpierw punkty trasy, potem wycieczka)
 */
exports.deleteTripCascade = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    await Waypoint.deleteMany({ trip: tripId });
    return await trip.deleteOne();
};

// --- LOGIKA PUNKTÓW TRASY (WAYPOINTS) ---

/**
 * Pobieranie wszystkich przystanków przypisanych do danej wycieczki
 */
exports.getWaypointsForTrip = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Waypoint.find({ trip: tripId }).sort('order_index');
};

/**
 * Ręczne dodawanie pojedynczego przystanku do wycieczki
 */
exports.addSingleWaypoint = async (tripId, waypointData, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Waypoint.create({ ...waypointData, trip: tripId });
};

/**
 * Aktualizacja danych konkretnego przystanku
 */
exports.updateWaypointData = async (waypointId, updateData, user) => {
    const waypoint = await Waypoint.findById(waypointId).populate('trip');
    checkOwnership(waypoint, user);
    return await Waypoint.findByIdAndUpdate(waypointId, updateData, { new: true, runValidators: true });
};

/**
 * Usuwanie pojedynczego przystanku z trasy
 */
exports.removeWaypoint = async (waypointId, user) => {
    const waypoint = await Waypoint.findById(waypointId).populate('trip');
    checkOwnership(waypoint, user);
    return await waypoint.deleteOne();
};

/**
 * Masowe usuwanie wszystkich przystanków z konkretnej wycieczki
 */
exports.removeAllWaypointsFromTrip = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Waypoint.deleteMany({ trip: tripId });
};

// --- FUNKCJE ADMINISTRACYJNE ---

/**
 * Pobieranie wszystkich wycieczek w systemie (Widok Admina)
 */
exports.adminGetAllTrips = async () => {
    return await Trip.find().populate('user', 'username email').populate('waypoints');
};

/**
 * Pobieranie wszystkich przystanków w systemie (Widok Admina)
 */
exports.adminGetAllWaypoints = async () => {
    return await Waypoint.find().populate('trip', 'title');
};

// --- LOGIKA AI ---

/**
 * Generowanie trasy przez AI, czyszczenie starych punktów i zapis nowych w bazie
 */
exports.generateAIWaypoints = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);

    const suggestedPoints = await aiService.generateWaypoints(trip, user);

    // Atomowa zamiana punktów: najpierw usuwamy stare, potem wstawiamy nowe
    await Waypoint.deleteMany({ trip: tripId });
    return await Promise.all(suggestedPoints.map(point => Waypoint.create({ ...point, trip: tripId })));
};