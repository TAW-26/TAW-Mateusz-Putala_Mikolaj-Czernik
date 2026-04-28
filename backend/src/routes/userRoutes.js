const express = require('express');
const router = express.Router();
const {
    deleteUser,
    getSystemStats,
    updateUserRole,
    getAllUsers,
    updateProfile,      // Musisz to zaimportować z kontrolera
    changePassword      // Musisz to zaimportować z kontrolera
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// 1. Trasy dostępne dla KAŻDEGO zalogowanego użytkownika
router.use(protect); // Wszyscy muszą być zalogowani

router.put('/profile', updateProfile); // Edycja profilu (dostępna dla 'user')
router.put('/change-password', changePassword); // Zmiana hasła (dostępna dla 'user')

// 2. Blokada - wszystko poniżej tej linii wymaga roli ADMINA
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/stats', getSystemStats);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;