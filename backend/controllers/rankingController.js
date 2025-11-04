
const { getTopUsersByXp } = require('../utils/leaderboard');
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const type = req.query.type || 'overall'; 
    let xpField;
    if (type === 'technical') xpField = 'xpTechnical';
    else if (type === 'business') xpField = 'xpBusiness';
    else xpField = 'totalXp';


    const topUsers = await getTopUsersByXp(xpField, 10);


    const currentUser = await User.findById(req.user.id).select(xpField);
    let userRank;
    if (currentUser) {
      const higher = await User.countDocuments({ [xpField]: { $gt: currentUser[xpField] } });
      userRank = higher + 1;
    }

    res.json({ topUsers, userRank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
