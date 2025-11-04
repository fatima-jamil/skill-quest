
const User = require('../models/User');
const { getTopUsersByXp } = require('../utils/leaderboard');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('badges')
      .populate('completedSkills');
    if (!user) return res.status(404).json({ message: 'User not found' });


    const name = user.name;
    const totalXp = user.totalXp;
    const skillsCompleted = user.completedSkills.length;
    const currentStreak = user.currentStreak;
    const longestStreak = user.longestStreak;


    const recentBadges = user.badges.slice(-5).reverse();


    const xpGrowth = []; 
    

    const startedSkillsProgress = []; 

    let monthlyChallengeCompleted = false;
    const now = new Date();

    if (user.lastActivityAt &&
        user.lastActivityAt.getMonth() === now.getMonth() &&
        user.lastActivityAt.getFullYear() === now.getFullYear()) {
      monthlyChallengeCompleted = true;
    }


    const higherRankCount = await User.countDocuments({ totalXp: { $gt: totalXp } });
    const overallRank = higherRankCount + 1;

    return res.json({
      name, totalXp, skillsCompleted, currentStreak, longestStreak,
      recentBadges, xpGrowth, startedSkillsProgress,
      monthlyChallengeCompleted, overallRank
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

