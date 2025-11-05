// utils/leaderboard.js
const User = require('../models/User');

/**
 * Retrieves top N users sorted by the given XP type.
 * @param {string} xpField - 'technicalXp', 'businessXp', or 'totalXp'
 * @param {number} limit - number of top users
 * @returns {Promise<Array>}
 */
const getTopUsersByXp = async (xpField, limit = 10) => {
  return User.find()
    .sort({ [xpField]: -1 })
    .limit(limit)
    .select(['_id', 'username', xpField])
    .lean();
};

module.exports = { getTopUsersByXp };
