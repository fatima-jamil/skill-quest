const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Skill = require('../models/Skill');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};


exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;


        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ 
                errors: [{ msg: 'Email is already registered' }] 
            });
        }


        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ 
                errors: [{ msg: 'Username is already taken' }] 
            });
        }


        const user = await User.create({
            username,
            email,
            password
        });


        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;


        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                errors: [{ msg: 'Invalid credentials' }] 
            });
        }


        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                errors: [{ msg: 'Invalid credentials' }] 
            });
        }


        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedSkills') // shows skill names from IDs
      .populate('badges');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const enrichedSkills = user.skills.map(skill => ({
      name: skill.name,
      type: skill.type,
      level: skill.level,
      experience: skill.experience,
      badges: skill.badges || []
    }));

    res.json({
      ...user.toObject(),
      skills: enrichedSkills
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
