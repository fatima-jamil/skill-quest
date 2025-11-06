const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  department: {
    type: String,
    required: true,
    enum: ['technical', 'business', 'other'],
    default: 'technical'
  },

  skills: [
    {
      name: String,
      type: {
        type: String,
        enum: ['technical', 'business'],
        required: true
      },
      level: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      experience: {
        type: Number,
        default: 0
      },
      completedAt: Date,  // ADDED: Track when skill was completed
      earnedXp: Number    // ADDED: Track XP earned from this skill
    }
  ],

  totalXp: { type: Number, default: 0 },
  technicalXp: { type: Number, default: 0 },
  businessXp: { type: Number, default: 0 },

  level: { type: Number, default: 1 },
  technicalLevel: { type: Number, default: 1 },
  businessLevel: { type: Number, default: 1 },

  overallRank: { type: String, default: 'Novice' },
  technicalRank: { type: String, default: 'Novice' },
  businessRank: { type: String, default: 'Novice' },

  completedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  completedChallenges: [
    {
      challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
      },
      completedAt: Date,
      earnedXp: Number
    }
  ],

  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityAt: { type: Date, default: null },
  lastMonthlyChallengeCompletedAt: { type: Date, default: null },

  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);