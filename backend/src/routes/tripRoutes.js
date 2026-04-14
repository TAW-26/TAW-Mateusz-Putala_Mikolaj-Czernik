const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {
    createTrip,
    getTrips,
    deleteTrip,
    addWaypoint,
    getAllTripsAdmin // <--- DODANO: import nowej funkcji dla admina
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware'); // <--- DODANO: middleware ról

// Middleware do łapania błędów walidacji
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// --- TRASY ADMINISTRACYJNE ---
// Ta trasa musi być przed trasami z /:id, aby Express nie pomylił "admin/all" z "ID wycieczki"
router.get('/admin/all', protect, authorize('admin'), getAllTripsAdmin);

// --- TRASY UŻYTKOWNIKA ---
router.route('/')
    .get(protect, getTrips)
    .post(protect, [
        body('title').notEmpty().withMessage('Tytuł nie może być pusty'),
        body('destination').notEmpty().withMessage('Cel podróży jest wymagany'),
        body('budget').isNumeric().withMessage('Budżet musi być liczbą')
    ], validate, createTrip);

router.route('/:id')
    .delete(protect, deleteTrip);

// Nowa trasa dla Waypointów
router.route('/:tripId/waypoints')
    .post(protect, [
        body('name').notEmpty().withMessage('Nazwa punktu jest wymagana')
    ], validate, addWaypoint);

module.exports = router;