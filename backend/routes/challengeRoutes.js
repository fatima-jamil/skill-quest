const express = require('express');
const router = express.Router();

const {
  listChallenges, 
  openChallenge,
  completeChallenge,
  completeMonthlyChallenge
} = require('../controllers/challengeController');

const { protect } = require('../middleware/authMiddleware');
router.get('/', protect, listChallenges);
router.post('/:id/open', protect, openChallenge);
router.post('/:id/complete', protect, completeChallenge);
router.post('/monthly', protect, completeMonthlyChallenge);

module.exports = router;
