// backend/utils/streak.js - FIXED VERSION

/**
 * Updates a user's streak based on last activity date.
 * @param {User} user - Mongoose user document
 * @returns {void}
 */
const updateStreak = (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  
  const last = user.lastActivityAt ? new Date(user.lastActivityAt) : null;
  
  if (last) {
    last.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    const diffTime = today - last;
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) {
      // Same day - don't increment streak
      return;
    } else if (diffDays === 1) {
      // Consecutive day - increment streak
      user.currentStreak += 1;
    } else {
      // Streak broken - reset to 1
      user.currentStreak = 1;
    }
  } else {
    // First activity ever - start streak at 1
    user.currentStreak = 1;
  }

  // Update longest streak if current is higher
  if (user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak;
  }

  // Update last activity date to today
  user.lastActivityAt = new Date();
};

module.exports = { updateStreak };