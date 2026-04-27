const express = require('express');
const router = express.Router();
const vacationController = require('../controllers/vacationController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', vacationController.getAll);
router.get('/:id', vacationController.getById);
router.post('/', vacationController.create);
router.put('/:id/approve', vacationController.approve);
router.put('/:id/reject', vacationController.reject);
router.delete('/:id', vacationController.delete);

module.exports = router;