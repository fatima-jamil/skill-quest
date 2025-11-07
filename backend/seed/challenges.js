// backend/seed/challenges.js
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Skill = require('../models/Skill');
const connectDB = require('../config/db');

const seedChallenges = async () => {
  try {
    await connectDB();
    
    // Delete only regular challenges (not monthly)
    await Challenge.deleteMany({ isMonthly: { $ne: true } });

    const skills = await Skill.find().limit(20);
    
    // Create only regular challenges (not monthly)
    const challenges = skills.map(skill => ({
      title: `${skill.name} Challenge`,
      skill: skill._id,
      xpReward: 250,
      isMonthly: false
    }));

    await Challenge.insertMany(challenges);
    console.log(`✅ Seeded ${challenges.length} regular challenges successfully.`);
    
    // Check if monthly challenge exists
    const monthlyExists = await Challenge.findOne({ isMonthly: true });
    if (monthlyExists) {
      console.log('✅ Monthly challenge already exists.');
    } else {
      console.log('⚠️ No monthly challenge found. Run: node seed/monthlyChallenge.js');
    }
  } catch (error) {
    console.error('🔥 Challenge seeding failed:', error);
  } finally {
    process.exit();
  }
};

seedChallenges();