

/**
 * Updates a user's streak based on last activity date.
 * @param {User} user - Mongoose user document
 * @returns {void}
 */
const updateStreak = (user) => {
  const today = new Date();
  const last = user.lastActivityAt ? new Date(user.lastActivityAt) : null;
  const oneDay = 24 * 60 * 60 * 1000;

  if (last) {
    const diff = Math.floor((today - last) / oneDay);
    if (diff === 1) {

      user.currentStreak += 1;
    } else if (diff > 1) {

      user.currentStreak = 1;
    }

  } else {

    user.currentStreak = 1;
  }


  if (user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak;
  }

  user.lastActivityAt = today;
};

module.exports = { updateStreak };
