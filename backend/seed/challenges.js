// seed/challenges.js
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Skill = require('../models/Skill');
const connectDB = require('../config/db');

const seedChallenges = async () => {
  try {
    await connectDB();
    await Challenge.deleteMany();

    const skills = await Skill.find().limit(20);
    
    const challenges = skills.map(skill => ({
      title: `${skill.name} Challenge`,
      skill: skill._id,
      xpReward: 250
    }));

    await Challenge.insertMany(challenges);
    console.log('✅ Seeded challenges successfully.');
  } catch (error) {
    console.error('🔥 Challenge seeding failed:', error);
  } finally {
    process.exit();
  }
};

seedChallenges();
