
const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/rankingController');
const { protect } = require('../middleware/authMiddleware');


router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
