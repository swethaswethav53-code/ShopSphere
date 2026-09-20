const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      // not required - some activities (like a search) may not target one product
    },
    activityType: {
      type: String,
      enum: ['view', 'search', 'add_to_cart', 'add_to_wishlist', 'purchase'],
      required: true,
    },
    searchQuery: {
      type: String,
      // only used when activityType === 'search'
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      // helps us know which category the user showed interest in, even for searches
    },
  },
  {
    timestamps: true, // createdAt tells us WHEN the activity happened
  }
);

// Speeds up our recommendation queries (fetching a user's recent activity)
userActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);