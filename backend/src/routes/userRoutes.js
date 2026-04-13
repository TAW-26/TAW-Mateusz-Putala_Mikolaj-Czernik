const express = require('express');
const router = express.Router();
const { deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Tylko zalogowany Admin może usuwać użytkowników
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;