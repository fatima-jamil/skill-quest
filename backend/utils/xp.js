
/**
 * Awards XP to a user for a given category.
 * @param {User} user - Mongoose user document
 * @param {string} category - 'technical' or 'business'
 * @param {number} amount - XP to add
 */
const awardXp = (user, category, amount) => {
  user.totalXp += amount;
  if (category === 'technical') {
    user.technicalXp += amount;
  } else if (category === 'business') {
    user.businessXp += amount;
  }
};

module.exports = { awardXp };
