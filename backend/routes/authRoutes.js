const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile 
} = require('../controllers/authController');
const { 
    registerValidation, 
    loginValidation 
} = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');


router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);


router.get('/profile', protect, getUserProfile);

module.exports = router;