const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { awardXp } = require('../utils/xp');
const { updateStreak } = require('../utils/streak');
const Badge = require('../models/Badge');


exports.listChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('skill');
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    const challenge = await Challenge.findById(req.params.id).populate('skill');
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicate challenge completion
    const alreadyCompleted = user.completedChallenges.some(
      (c) => c.challengeId.toString() === challenge._id.toString()
    );
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    // Award XP
    awardXp(user, challenge.skill.category, challenge.xpReward);

    // ✅ Add or update user's skill tracking
    const existingSkill = user.skills.find(
      (s) => s.name === challenge.skill.name && s.type === challenge.skill.category
    );

    if (!existingSkill) {
      user.skills.push({
        name: challenge.skill.name,
        type: challenge.skill.category,
        level: 1,
        experience: challenge.xpReward,
        badges: []
      });
    } else {
      existingSkill.experience += challenge.xpReward;
      existingSkill.level = Math.floor(existingSkill.experience / 100); // example level-up logic
    }

    // Create badge
    const badge = await Badge.create({
      name: 'Challenge Master',
      description: 'Completed a challenge with grace and possibly caffeine.',
      icon: ''
    });
    user.badges.push(badge._id);

    // Mark challenge complete
    user.completedChallenges.push({
      challengeId: challenge._id,
      completedAt: new Date(),
      earnedXp: challenge.xpReward
    });

    // Mark skill as completed (first time only)
    if (!user.completedSkills.includes(challenge.skill._id)) {
      user.completedSkills.push(challenge.skill._id);
    }

    updateStreak(user);
    await user.save();

    res.json({ message: 'Challenge completed', totalXp: user.totalXp });
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
    const lastMonthly = user.lastMonthlyChallengeCompletedAt;

    if (
      lastMonthly &&
      lastMonthly.getMonth() === now.getMonth() &&
      lastMonthly.getFullYear() === now.getFullYear()
    ) {
      return res.status(400).json({ message: 'Monthly challenge already completed' });
    }

    // Award XP
    const monthlyXp = 1000;
    awardXp(user, 'technical', monthlyXp);

    // Create and assign 5 badges
    for (let i = 1; i <= 5; i++) {
      const badge = await Badge.create({
        name: `Monthly Challenge Badge ${i}`,
        description: `Badge ${i} for completing the monthly challenge`,
        icon: '' // or a real icon path if needed
      });

      user.badges.push(badge._id); // Only the ID goes in
    }

    user.lastMonthlyChallengeCompletedAt = now;
    updateStreak(user);
    await user.save();

    res.json({ message: 'Monthly challenge completed', totalXp: user.totalXp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
