
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  xpReward: {
    type: Number,
    required: true,
    min: 0
  },
  isMonthly: {
    type: Boolean,
    default: false
  },
  availableUntil: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
