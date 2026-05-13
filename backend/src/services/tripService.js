const Trip = require('../models/Trip');
const Waypoint = require('../models/Waypoint');
const aiService = require('./aiService');

const checkOwnership = (resource, user) => {
    if (!resource) throw new Error('Nie znaleziono zasobu');
    // Sprawdzamy czy to Trip czy Waypoint (Waypoint ma trip.user po populate)
    const ownerId = resource.user ? resource.user.toString() : resource.trip?.user?.toString();

    if (ownerId !== user.id && user.role !== 'admin') {
        throw new Error('Brak uprawnień');
    }
};

exports.getUserTrips = async (userId) => {
    return await Trip.find({ user: userId })
        .populate({ path: 'waypoints', options: { sort: { 'order_index': 1 } } })
        .sort('-createdAt');
};

exports.getSingleTrip = async (tripId, user) => {
    const trip = await Trip.findById(tripId).populate({
        path: 'waypoints',
        options: { sort: { 'order_index': 1 } }
    });
    checkOwnership(trip, user);
    return trip;
};

exports.createSmartTrip = async (tripData, userId) => {
    return await Trip.create({ ...tripData, user: userId });
};

exports.updateTripData = async (tripId, updateData, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Trip.findByIdAndUpdate(tripId, updateData, { new: true, runValidators: true });
};

exports.deleteTripCascade = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    await Waypoint.deleteMany({ trip: tripId });
    return await trip.deleteOne();
};

// --- WAYPOINTS ---

exports.getWaypointsForTrip = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Waypoint.find({ trip: tripId }).sort('order_index');
};

exports.addSingleWaypoint = async (tripId, waypointData, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    return await Waypoint.create({ ...waypointData, trip: tripId });
};

exports.updateWaypointData = async (waypointId, updateData, user) => {
    const waypoint = await Waypoint.findById(waypointId).populate('trip');
    checkOwnership(waypoint, user);
    return await Waypoint.findByIdAndUpdate(waypointId, updateData, { new: true, runValidators: true });
};

exports.removeWaypoint = async (waypointId, user) => {
    const waypoint = await Waypoint.findById(waypointId).populate('trip');
    checkOwnership(waypoint, user);
    return await waypoint.deleteOne();
};

exports.removeAllWaypointsFromTrip = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);

    return await Waypoint.deleteMany({ trip: tripId });
};

// --- ADMIN ---

exports.adminGetAllTrips = async () => {
    return await Trip.find().populate('user', 'username email').populate('waypoints');
};

exports.adminGetAllWaypoints = async () => {
    return await Waypoint.find().populate('trip', 'title');
};

// --- AI ---

exports.generateAIWaypoints = async (tripId, user) => {
    const trip = await Trip.findById(tripId);
    checkOwnership(trip, user);
    const suggestedPoints = await aiService.generateWaypoints(trip, user);
    await Waypoint.deleteMany({ trip: tripId });
    return await Promise.all(suggestedPoints.map(point => Waypoint.create({ ...point, trip: tripId })));
};