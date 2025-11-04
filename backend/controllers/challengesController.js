
const Skill = require('../models/Skill');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { updateStreak } = require('../utils/streak');
const { awardXp } = require('../utils/xp');

exports.openChallenge = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    updateStreak(user);
    await user.save();

    res.json({ message: 'Challenge opened, streak updated', currentStreak: user.currentStreak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeChallenge = async (req, res) => {
  try {
    const skillId = req.params.id;
    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });


    awardXp(user, skill.category, skill.xpReward);


    const badge = await Badge.create({
      name: `${skill.name} Challenge Badge`,
      description: `Awarded for completing the ${skill.name} challenge.`,
      icon: ''
    });
    user.badges.push(badge._id);


    if (!user.completedSkills.includes(skill._id)) {
      user.completedSkills.push(skill._id);
    }

    await user.save();
    res.json({ message: 'Challenge completed, XP and badge awarded', totalXp: user.totalXp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeMonthlyChallenge = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });


    const now = new Date();
    if (user.lastActivityAt &&
        user.lastActivityAt.getMonth() === now.getMonth() &&
        user.lastActivityAt.getFullYear() === now.getFullYear()) {
      return res.status(400).json({ message: 'Monthly challenge already completed' });
    }


    const monthlyXp = 1000;
    awardXp(user, 'technical', monthlyXp); 

    for (let i = 1; i <= 5; i++) {
      const badge = await Badge.create({
        name: `Monthly Challenge Badge ${i}`,
        description: `Badge ${i} for completing the monthly challenge.`,
        icon: ''
      });
      user.badges.push(badge._id);
    }


    updateStreak(user);
    await user.save();

    res.json({ message: 'Monthly challenge completed', totalXp: user.totalXp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
