const UserActivity = require('../models/UserActivity');
const Product = require('../models/Product');

// Weight given to each activity type - purchases matter far more than views
const ACTIVITY_WEIGHTS = {
  purchase: 5,
  add_to_cart: 3,
  add_to_wishlist: 2,
  view: 1,
  search: 1,
};

// @desc    Get personalized product recommendations for the logged-in user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = Number(req.query.limit) || 10;

    // Step 1: Fetch the user's recent activity (last 100 actions is enough signal)
    const activities = await UserActivity.find({ user: userId })
      .populate('product', 'category tags')
      .sort({ createdAt: -1 })
      .limit(100);

    // If user has no activity at all -> fallback to popular products
    if (activities.length === 0) {
      const popularProducts = await Product.find()
        .sort({ ratingsAverage: -1, numReviews: -1 })
        .limit(limit)
        .populate('category', 'name');

      return res.status(200).json({
        success: true,
        strategy: 'popular', // tells frontend WHY these were shown (useful for debugging/UI)
        data: popularProducts,
      });
    }

    // Step 2 & 3: Build a weighted interest profile of categories and tags
    const categoryScores = {}; // { categoryId: totalScore }
    const tagScores = {}; // { tagName: totalScore }
    const interactedProductIds = new Set(); // products to EXCLUDE from recommendations

    for (const activity of activities) {
      const weight = ACTIVITY_WEIGHTS[activity.activityType] || 0;

      // Track products the user already interacted with, so we don't recommend them again
      if (activity.product) {
        interactedProductIds.add(activity.product._id.toString());
      }

      // Score category (from the activity itself, or from the populated product)
      const categoryId = activity.category
        ? activity.category.toString()
        : activity.product && activity.product.category
        ? activity.product.category.toString()
        : null;

      if (categoryId) {
        categoryScores[categoryId] = (categoryScores[categoryId] || 0) + weight;
      }

      // Score tags (only available via the product, not searches)
      if (activity.product && activity.product.tags) {
        for (const tag of activity.product.tags) {
          tagScores[tag] = (tagScores[tag] || 0) + weight;
        }
      }
    }

    // Get the top 3 categories the user seems most interested in
    const topCategoryIds = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([categoryId]) => categoryId);

    // Get the top 5 tags the user seems most interested in
    const topTags = Object.entries(tagScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    // Step 4: Find candidate products matching top categories or tags,
    // excluding products the user already interacted with
    const candidates = await Product.find({
      _id: { $nin: Array.from(interactedProductIds) },
      $or: [
        { category: { $in: topCategoryIds } },
        { tags: { $in: topTags } },
      ],
    }).populate('category', 'name');

    // Step 5: Score each candidate by how well it matches the user's profile
    const scoredCandidates = candidates.map((product) => {
      let score = 0;

      if (topCategoryIds.includes(product.category._id.toString())) {
        score += 2; // category match is a decent signal
      }

      const matchingTags = product.tags.filter((tag) => topTags.includes(tag));
      score += matchingTags.length * 1.5; // each matching tag adds more weight

      // slight boost for well-rated products, as a tiebreaker
      score += product.ratingsAverage * 0.1;

      return { product, score };
    });

    // Step 6: Sort by score, return top N
    scoredCandidates.sort((a, b) => b.score - a.score);
    const recommendations = scoredCandidates.slice(0, limit).map((item) => item.product);

    // Edge case: not enough personalized matches found - top up with popular products
    if (recommendations.length < limit) {
      const alreadyRecommendedIds = recommendations.map((p) => p._id.toString());
      const excludeIds = [...interactedProductIds, ...alreadyRecommendedIds];

      const fillerProducts = await Product.find({
        _id: { $nin: excludeIds },
      })
        .sort({ ratingsAverage: -1 })
        .limit(limit - recommendations.length)
        .populate('category', 'name');

      recommendations.push(...fillerProducts);
    }

    res.status(200).json({
      success: true,
      strategy: 'content-based',
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };