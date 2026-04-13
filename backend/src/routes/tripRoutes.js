const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { createTrip, getTrips, deleteTrip, addWaypoint } = require('../controllers/tripController'); // Dodano addWaypoint
const { protect } = require('../middleware/authMiddleware');

// Middleware do łapania błędów walidacji
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.route('/')
    .get(protect, getTrips)
    .post(protect, [
        body('title').notEmpty().withMessage('Tytuł nie może być pusty'),
        body('destination').notEmpty().withMessage('Cel podróży jest wymagany'),
        body('budget').isNumeric().withMessage('Budżet musi być liczbą')
    ], validate, createTrip);

router.route('/:id')
    .delete(protect, deleteTrip);

// Nowa trasa dla Waypointów (zgodna z diagramem klas: Trip contains Waypoints)
router.route('/:tripId/waypoints')
    .post(protect, [
        body('name').notEmpty().withMessage('Nazwa punktu jest wymagana')
    ], validate, addWaypoint);

module.exports = router;