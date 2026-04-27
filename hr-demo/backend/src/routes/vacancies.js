const express = require('express');
const router = express.Router();
const vacancyController = require('../controllers/vacancyController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', vacancyController.getAll);
router.get('/:id', vacancyController.getById);
router.post('/', vacancyController.create);
router.put('/:id', vacancyController.update);
router.put('/:id/close', vacancyController.close);
router.delete('/:id', vacancyController.delete);

module.exports = router;