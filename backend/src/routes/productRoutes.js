const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} = require('../controllers/productController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct)
  .delete(protect, admin, deleteAllProducts);

router.route('/:id')
  .get(optionalAuth, getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;