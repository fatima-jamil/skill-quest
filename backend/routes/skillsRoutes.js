const express = require('express');
const router = express.Router();
const { listSkills, completeSkill } = require('../controllers/skillsController');
const { protect } = require('../middleware/authMiddleware');



router.use(protect);


router.get('/', listSkills);
router.post('/:id/complete', completeSkill);

module.exports = router;
