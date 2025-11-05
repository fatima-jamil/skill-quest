// controllers/rankingController.js
const { getTopUsersByXp } = require('../utils/leaderboard');
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const type = req.query.type || 'overall';
    let xpField;

    if (type === 'technical') xpField = 'technicalXp';
    else if (type === 'business') xpField = 'businessXp';
    else xpField = 'totalXp';

    // Get top 10 users by XP
    const topUsers = await getTopUsersByXp(xpField, 10);

    // Get current user's XP and calculate rank
    const currentUser = await User.findById(req.user.id).select(['_id', 'username', xpField]);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const higherCount = await User.countDocuments({
      [xpField]: { $gt: currentUser[xpField] }
    });
    const userRank = higherCount + 1;

    res.json({
      topUsers,
      currentUser: {
        id: currentUser._id,
        username: currentUser.username,
        xp: currentUser[xpField],
        rank: userRank
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
