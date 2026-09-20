const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Recalculate and save a product's average rating + review count
const updateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10, // round to 1 decimal
      numReviews: stats[0].numReviews,
    });
  } else {
    // no reviews left (e.g., last review was deleted)
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      numReviews: 0,
    });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review for a product
// @route   POST /api/reviews/:productId
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || !comment) {
      res.status(400);
      throw new Error('Please provide rating and comment');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    await updateProductRatings(productId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    // Mongoose duplicate key error -> user already reviewed this product
    if (error.code === 11000) {
      res.status(400);
      error.message = 'You have already reviewed this product';
    }
    next(error);
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // only the review's owner can edit it
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this review');
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();
    await updateProductRatings(review.product);

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own review (or admin can delete any)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRatings(productId);

    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL reviews across all products (admin moderation view)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
};