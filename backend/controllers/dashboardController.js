// controllers/dashboardController.js
const User = require('../models/User');
const { getTopUsersByXp } = require('../utils/leaderboard');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('badges')
      .populate('completedSkills');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const name = user.username;
    const totalXp = user.totalXp;
    const skillsCompleted = new Set(user.completedSkills.map(skill => skill.name)).size;
    const currentStreak = user.currentStreak;
    const longestStreak = user.longestStreak;
    const recentBadges = user.badges.slice(-5).reverse();

    // XP Growth (last 7 days)
    const xpGrowth = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const xpThatDay = user.completedChallenges
        .filter(c => new Date(c.completedAt) >= dayStart && new Date(c.completedAt) <= dayEnd)
        .reduce((sum, c) => sum + (c.earnedXp || 0), 0);

      return {
        date: dayStart.toISOString().split('T')[0],
        xp: xpThatDay
      };
    });

    // Progress for all started skills
    const startedSkillsProgress = user.skills.map(skill => ({
      name: skill.name,
      type: skill.type,
      level: skill.level,
      experience: skill.experience
    }));

    // Monthly challenge check
    const now = new Date();
    const monthlyChallengeCompleted = user.lastMonthlyChallengeCompletedAt &&
      user.lastMonthlyChallengeCompletedAt.getMonth() === now.getMonth() &&
      user.lastMonthlyChallengeCompletedAt.getFullYear() === now.getFullYear();

    // Overall rank
    const higherRankCount = await User.countDocuments({ totalXp: { $gt: totalXp } });
    const overallRank = higherRankCount + 1;

    res.json({
      name,
      totalXp,
      skillsCompleted,
      currentStreak,
      longestStreak,
      recentBadges,
      xpGrowth,
      startedSkillsProgress,
      monthlyChallengeCompleted,
      overallRank
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
