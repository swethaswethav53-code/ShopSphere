const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder, // <-- 1. Import cancelOrder controller here
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

// 2. Add the user-driven cancel order route here
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;