
/**
 * Awards XP to a user for a given category.
 * @param {User} user - Mongoose user document
 * @param {string} category - 'technical' or 'business'
 * @param {number} amount - XP to add
 */
const awardXp = (user, category, amount) => {
  user.totalXp += amount;
  if (category === 'technical') {
    user.xpTechnical += amount;
  } else if (category === 'business') {
    user.xpBusiness += amount;
  }
};

module.exports = { awardXp };
