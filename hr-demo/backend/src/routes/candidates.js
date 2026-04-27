const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', candidateController.getAll);
router.get('/:id', candidateController.getById);
router.post('/', candidateController.create);
router.put('/:id/status', candidateController.updateStatus);
router.delete('/:id', candidateController.delete);

module.exports = router;