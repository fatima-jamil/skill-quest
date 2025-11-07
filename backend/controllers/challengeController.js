const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { awardXp } = require('../utils/xp');
const { updateStreak } = require('../utils/streak');
const Badge = require('../models/Badge');

// ✅ LIST ALL CHALLENGES
exports.listChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const challenges = await Challenge.find().populate('skill');
    
    // Add completion status to each challenge
    const challengesWithStatus = challenges.map(challenge => {
      const isCompleted = user.completedChallenges.some(
        c => c.challengeId.toString() === challenge._id.toString()
      );
      
      return {
        ...challenge.toObject(),
        isCompleted
      };
    });

    res.json(challengesWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ OPEN A CHALLENGE (updates streak)
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

// ✅ COMPLETE A CHALLENGE
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

    // Award XP (with FIXED field names)
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

    // Create badge for completing the challenge
    const badge = await Badge.create({
      name: `${challenge.skill.name} Challenge Master`,
      description: `Completed the ${challenge.skill.name} challenge`,
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

    res.json({ 
      message: 'Challenge completed', 
      totalXp: user.totalXp,
      technicalXp: user.technicalXp,
      businessXp: user.businessXp,
      badge: badge
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ COMPLETE MONTHLY CHALLENGE - FIXED: Only 1 badge instead of 5
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

    // Award XP for monthly challenge (typically technical category)
    const monthlyXp = 1000;
    awardXp(user, 'technical', monthlyXp);

    // FIXED: Create and assign only 1 badge instead of 5
    const badge = await Badge.create({
      name: `Monthly Challenge Champion`,
      description: `Completed the monthly mega challenge`,
      icon: ''
    });
    user.badges.push(badge._id);

    user.lastMonthlyChallengeCompletedAt = now;
    updateStreak(user);
    await user.save();

    res.json({ 
      message: 'Monthly challenge completed', 
      totalXp: user.totalXp,
      technicalXp: user.technicalXp,
      businessXp: user.businessXp,
      badges: [badge] // Return as array for consistency
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};