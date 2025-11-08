
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Skill = require('../models/Skill');
const connectDB = require('../config/db');

const seedMonthlyChallenge = async () => {
  try {
    await connectDB();
    

    await Challenge.deleteMany({ isMonthly: true });


    const skills = await Skill.find().limit(1);
    
    if (skills.length === 0) {
      console.log('⚠️ No skills found. Please run skills seed first.');
      process.exit(1);
    }


    const monthlyChallenge = {
      title: 'Monthly Mega Challenge',
      skill: skills[0]._id,
      xpReward: 1000,
      isMonthly: true,
      availableUntil: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) 
    };

    await Challenge.create(monthlyChallenge);
    console.log('✅ Monthly challenge seeded successfully!');
    console.log(`   Title: ${monthlyChallenge.title}`);
    console.log(`   XP Reward: ${monthlyChallenge.xpReward}`);
    console.log(`   Available Until: ${monthlyChallenge.availableUntil.toLocaleDateString()}`);
  } catch (error) {
    console.error('🔥 Monthly challenge seeding failed:', error);
  } finally {
    process.exit();
  }
};

seedMonthlyChallenge();