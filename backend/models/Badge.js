
const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
