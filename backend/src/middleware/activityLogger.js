const UserActivity = require('../models/UserActivity');

// Logs a user activity WITHOUT blocking or slowing down the actual response.
// Call this from inside controllers after the main action succeeds.
const logActivity = async ({ userId, productId, activityType, searchQuery, categoryId }) => {
  try {
    await UserActivity.create({
      user: userId,
      product: productId || undefined,
      activityType,
      searchQuery: searchQuery || undefined,
      category: categoryId || undefined,
    });
  } catch (error) {
    // IMPORTANT: never let a logging failure break the main feature (e.g., viewing a product)
    console.error('Activity logging failed:', error.message);
  }
};

module.exports = { logActivity };