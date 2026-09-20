const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllReviews);
router.get('/:productId', getProductReviews);
router.post('/:productId', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;