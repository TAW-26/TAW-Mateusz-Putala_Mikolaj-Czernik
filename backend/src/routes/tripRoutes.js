const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {
    createTrip,
    getTrips,
    getTrip,
    updateTrip,
    deleteTrip,
    addWaypoint,
    getWaypointsByTrip,
    updateWaypoint,
    deleteWaypoint,
    deleteAllWaypoints,
    getAllTripsAdmin,
    getAllWaypointsAdmin
} = require('../controllers/tripController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Middleware do łapania błędów walidacji
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// --- TRASY ADMINISTRACYJNE ---
router.get('/admin/all', protect, authorize('admin'), getAllTripsAdmin);
router.get('/admin/all/waypoints', protect, authorize('admin'), getAllWaypointsAdmin);

// --- TRASY UŻYTKOWNIKA (WYCIECZKI) ---
router.route('/')
    .get(protect, getTrips)
    .post(protect, [
        body('title').notEmpty().withMessage('Tytuł nie może być pusty'),
        body('destination.address').notEmpty().withMessage('Cel podróży (adres) jest wymagany'),
        // Tutaj dodaliśmy .optional(), aby brak budżetu nie blokował stworzenia wycieczki
        body('budget')
            .optional({ checkFalsy: true })
            .isNumeric()
            .withMessage('Budżet musi być liczbą')
    ], validate, createTrip);

router.route('/:id')
    .get(protect, getTrip)
    .put(protect, updateTrip)
    .delete(protect, deleteTrip);

// --- ZARZĄDZANIE PUNKTAMI TRASY (WAYPOINTS) ---

// Trasa: /api/trips/:tripId/waypoints
router.route('/:tripId/waypoints')
    .get(protect, getWaypointsByTrip)
    .post(protect, [
        body('name').notEmpty().withMessage('Nazwa punktu jest wymagana'),
        body('order_index').optional().isNumeric().withMessage('Kolejność musi być liczbą')
    ], validate, addWaypoint)
    .delete(protect, deleteAllWaypoints);

// Trasa: /api/trips/waypoints/:id
router.route('/waypoints/:id')
    .put(protect, updateWaypoint)
    .delete(protect, deleteWaypoint);

module.exports = router;