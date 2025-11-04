const mongoose = require('mongoose');
const Skill = require('../models/Skill');
require('dotenv').config({ path: './config.env' }); 

const skills = [
  { name: 'JavaScript Fundamentals', category: 'technical', xpReward: 100 },
  { name: 'Node.js Basics', category: 'technical', xpReward: 120 },
  { name: 'Express.js Routing', category: 'technical', xpReward: 130 },
  { name: 'MongoDB CRUD', category: 'technical', xpReward: 110 },
  { name: 'React Basics', category: 'technical', xpReward: 140 },
  { name: 'Redux for State Management', category: 'technical', xpReward: 150 },
  { name: 'REST API Design', category: 'technical', xpReward: 135 },
  { name: 'Authentication & JWT', category: 'technical', xpReward: 160 },
  { name: 'Git & Version Control', category: 'technical', xpReward: 90 },
  { name: 'Docker Essentials', category: 'technical', xpReward: 170 },

  { name: 'Communication Skills', category: 'business', xpReward: 100 },
  { name: 'Time Management', category: 'business', xpReward: 90 },
  { name: 'Leadership 101', category: 'business', xpReward: 120 },
  { name: 'Project Planning', category: 'business', xpReward: 110 },
  { name: 'Sales Fundamentals', category: 'business', xpReward: 130 },
  { name: 'Negotiation Tactics', category: 'business', xpReward: 140 },
  { name: 'Digital Marketing Basics', category: 'business', xpReward: 150 },
  { name: 'Public Speaking', category: 'business', xpReward: 80 },
  { name: 'Financial Literacy', category: 'business', xpReward: 95 },
  { name: 'Critical Thinking', category: 'business', xpReward: 125 }
];


const seedSkills = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB for seeding.');

    await Skill.deleteMany({});
    console.log('Old skills deleted.');

    const result = await Skill.insertMany(skills);
    console.log(`Inserted ${result.length} skills.`);

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedSkills();
