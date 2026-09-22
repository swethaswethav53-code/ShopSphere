const { logActivity } = require('../middleware/activityLogger');
const Product = require('../models/Product'); // needed to get category for logging
const Wishlist = require('../models/Wishlist');

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name price images ratingsAverage'
    );

    // if user has no wishlist yet, return an empty one (don't error)
    if (!wishlist) {
      wishlist = { user: req.user._id, products: [] };
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      // avoid duplicate entries
      if (wishlist.products.includes(productId)) {
        res.status(400);
        throw new Error('Product already in wishlist');
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }

    // Populate products before sending response so frontend gets full details
    wishlist = await wishlist.populate(
      'products',
      'name price images ratingsAverage'
    );

    // NEW: log this wishlist activity
    const product = await Product.findById(productId);
    if (product) {
      logActivity({
        userId: req.user._id,
        productId: product._id,
        activityType: 'add_to_wishlist',
        categoryId: product.category,
      });
    }

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    // Populate products so the frontend receives full product objects instead of just IDs
    wishlist = await wishlist.populate(
      'products',
      'name price images ratingsAverage'
    );

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };