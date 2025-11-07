// controllers/dashboardController.js
const User = require('../models/User');

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

    // XP Growth (last 7 days) - FIXED to include monthly challenge
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const xpGrowth = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Calculate XP from regular challenges completed on this day
      const challengeXp = user.completedChallenges
        .filter(c => {
          const completedDate = new Date(c.completedAt);
          return completedDate >= dayStart && completedDate <= dayEnd;
        })
        .reduce((sum, c) => sum + (c.earnedXp || 0), 0);

      // Calculate XP from skills completed on this day
      const skillXp = user.skills
        .filter(s => {
          if (s.completedAt) {
            const completedDate = new Date(s.completedAt);
            return completedDate >= dayStart && completedDate <= dayEnd;
          }
          return false;
        })
        .reduce((sum, s) => sum + (s.earnedXp || 0), 0);

      // FIXED: Calculate XP from monthly challenge completed on this day
      let monthlyXp = 0;
      if (user.lastMonthlyChallengeCompletedAt) {
        const monthlyDate = new Date(user.lastMonthlyChallengeCompletedAt);
        if (monthlyDate >= dayStart && monthlyDate <= dayEnd) {
          monthlyXp = 1000; // Monthly challenge XP reward
        }
      }

      return {
        date: dayStart.toISOString().split('T')[0],
        xp: challengeXp + skillXp + monthlyXp
      };
    });

    // Progress for all started skills
    const startedSkillsProgress = user.skills.map(skill => ({
      name: skill.name,
      type: skill.type,
      level: skill.level,
      experience: skill.experience
    }));

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
      overallRank
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};