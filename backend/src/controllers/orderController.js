const { logActivity } = require('../middleware/activityLogger');
const Order = require('../models/Order');
const Cart = require('../models/cart');
const Product = require('../models/Product');

// @desc    Place a new order (checkout) using items from the user's cart
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    // Validate shipping address including phone, excluding country
    if (
      !shippingAddress ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      res.status(400);
      throw new Error('Please provide complete shipping address including phone number');
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || !cart.items || cart.items.length === 0) {
      res.status(400);
      throw new Error('Your cart is empty');
    }

    // Build order items (snapshotting current name, image, and price) + validate stock
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      // If product no longer exists in DB, skip it gracefully instead of crashing
      if (!product) {
        continue;
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        // Fixed: product.image-ku pathila product.images[0] use seyyappattullathu
        image: product.images && product.images.length > 0 ? product.images[0] : '', 
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    // Ensure we have at least one valid item to order
    if (orderItems.length === 0) {
      res.status(400);
      throw new Error('Your cart contains no valid products');
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
    });

    // Reduce stock for each purchased product and log purchase activity
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });

      // log purchase activity for each product bought
      const productDoc = await Product.findById(item.product);
      logActivity({
        userId: req.user._id,
        productId: item.product,
        activityType: 'purchase',
        categoryId: productDoc ? productDoc.category : undefined,
      });
    }

    // Clear the cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's own orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid order status');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order by user
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if the order belongs to the logged-in user
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this order');
    }

    // Only pending orders can be cancelled by user
    if (order.status !== 'pending' && order.status !== 'processing') {
      res.status(400);
      throw new Error('Order cannot be cancelled at this stage');
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};