const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', positionController.getAll);
router.get('/:id', positionController.getById);
router.post('/', positionController.create);
router.put('/:id', positionController.update);
router.delete('/:id', positionController.delete);

module.exports = router;