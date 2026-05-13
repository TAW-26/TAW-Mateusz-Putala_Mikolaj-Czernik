const tripService = require('../services/tripService');

exports.createTrip = async (req, res) => {
    try {
        const trip = await tripService.createSmartTrip(req.body, req.user.id);
        res.status(201).json({ success: true, data: trip });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getTrips = async (req, res) => {
    try {
        const trips = await tripService.getUserTrips(req.user.id);
        res.status(200).json({ success: true, count: trips.length, data: trips });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getTrip = async (req, res) => {
    try {
        const trip = await tripService.getSingleTrip(req.params.id, req.user);
        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        res.status(err.message === 'Brak uprawnień' ? 401 : 404).json({ message: err.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const trip = await tripService.updateTripData(req.params.id, req.body, req.user);
        res.status(200).json({ success: true, data: trip });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        await tripService.deleteTripCascade(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Usunięto pomyślnie' });
    } catch (err) {
        res.status(err.message === 'Brak uprawnień' ? 401 : 404).json({ error: err.message });
    }
};

// --- WAYPOINT CONTROLLERS ---

exports.getWaypointsByTrip = async (req, res) => {
    try {
        const waypoints = await tripService.getWaypointsForTrip(req.params.tripId, req.user);
        res.status(200).json({ success: true, data: waypoints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addWaypoint = async (req, res) => {
    try {
        const waypoint = await tripService.addSingleWaypoint(req.params.tripId, req.body, req.user);
        res.status(201).json({ success: true, data: waypoint });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateWaypoint = async (req, res) => {
    try {
        const waypoint = await tripService.updateWaypointData(req.params.id, req.body, req.user);
        res.status(200).json({ success: true, data: waypoint });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteWaypoint = async (req, res) => {
    try {
        await tripService.removeWaypoint(req.params.id, req.user);
        res.status(200).json({ success: true, message: 'Punkt usunięty' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAllWaypoints = async (req, res) => {
    try {
        await tripService.removeAllWaypointsFromTrip(req.params.tripId, req.user);

        res.status(200).json({
            success: true,
            message: 'Wszystkie punkty trasy zostały usunięte'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- ADMIN CONTROLLERS ---

exports.getAllTripsAdmin = async (req, res) => {
    try {
        const trips = await tripService.adminGetAllTrips();
        res.status(200).json({ success: true, data: trips });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllWaypointsAdmin = async (req, res) => {
    try {
        const waypoints = await tripService.adminGetAllWaypoints();
        res.status(200).json({ success: true, data: waypoints });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- AI ---

exports.generateAITrip = async (req, res) => {
    try {
        const waypoints = await tripService.generateAIWaypoints(req.params.id, req.user);
        res.status(200).json({ success: true, data: waypoints });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};