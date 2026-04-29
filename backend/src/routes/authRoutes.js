const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { updateProfile } = require('../controllers/userController'); // Importujemy z userController
const { protect } = require('../middleware/authMiddleware');

// Ścieżki publiczne
router.post('/register', register);
router.post('/login', login);

// Ścieżki prywatne (wymagają zalogowania)
router.put('/profile', protect, updateProfile);

module.exports = router;


