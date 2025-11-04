
const Skill = require('../models/Skill');
const User = require('../models/User');
const { awardXp } = require('../utils/xp');

exports.listSkills = async (req, res) => {
  try {
    const category = req.query.category; 
    const filter = {};
    if (category) filter.category = category;
    const skills = await Skill.find(filter);
    return res.json(skills);
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
    await user.save();

    res.json({ message: 'Skill completed', totalXp: user.totalXp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
