
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['technical', 'business'], required: true },
  xpReward: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
