
const Skill = require('../models/Skill');
const User = require('../models/User');
const { awardXp } = require('../utils/xp');
const { updateStreak } = require('../utils/streak');


exports.listSkills = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = {};
    if (category) filter.category = category;
    
    const skills = await Skill.find(filter);
    

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    

    const skillsWithStatus = skills.map(skill => {
      const isCompleted = user.completedSkills.some(
        completedId => completedId.toString() === skill._id.toString()
      );
      
      return {
        ...skill.toObject(),
        isCompleted
      };
    });
    
    return res.json(skillsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeSkill = async (req, res) => {
  try {
    const skillId = req.params.id;
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });


    if (user.completedSkills.includes(skill._id)) {
      return res.status(400).json({ message: 'Skill already completed' });
    }


    user.completedSkills.push(skill._id);


    awardXp(user, skill.category, skill.xpReward);


    const existingSkill = user.skills.find(
      s => s.name === skill.name && s.type === skill.category
    );

    if (existingSkill) {
      existingSkill.completedAt = new Date();
      existingSkill.earnedXp = skill.xpReward;
      existingSkill.experience += skill.xpReward;
      existingSkill.level = Math.floor(existingSkill.experience / 100);
    } else {
      user.skills.push({
        name: skill.name,
        type: skill.category,
        level: 1,
        experience: skill.xpReward,
        completedAt: new Date(),
        earnedXp: skill.xpReward
      });
    }


    updateStreak(user);
    
    await user.save();

    res.json({ 
      message: 'Skill completed', 
      totalXp: user.totalXp,
      currentStreak: user.currentStreak 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};