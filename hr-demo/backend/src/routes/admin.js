const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Все маршруты требуют авторизации и роли admin
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id/role', adminController.updateUserRole);
router.post('/users/:id/reset-password', adminController.resetPassword);
router.put('/users/:id/block', adminController.blockUser);

module.exports = router;