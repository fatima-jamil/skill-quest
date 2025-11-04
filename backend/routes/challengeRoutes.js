
const express = require('express');
const router = express.Router();
const {
  openChallenge, completeChallenge, completeMonthlyChallenge
} = require('../controllers/challengesController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/open', protect, openChallenge);
router.post('/:id/complete', protect, completeChallenge);
router.post('/monthly', protect, completeMonthlyChallenge);

module.exports = router;
