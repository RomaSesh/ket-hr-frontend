const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.get('/headcount', reportController.getHeadcount);
router.get('/vacation_stats', reportController.getVacationStats);
router.get('/turnover', reportController.getTurnover);

module.exports = router;