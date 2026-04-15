const express = require('express');
const router = express.Router();
const {
    deleteUser,
    getSystemStats,
    updateUserRole,
    getAllUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Wszystkie trasy poniżej wymagają bycia Adminem
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/stats', getSystemStats);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;