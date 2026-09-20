const { logActivity } = require('../middleware/activityLogger');
const Cart = require('../models/cart');
const Product = require('../models/product');

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images stock'
    );

    if (!cart) {
      cart = { user: req.user._id, items: [] };
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or increase quantity if already in cart)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400);
      throw new Error('Please provide productId and quantity');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      res.status(400);
      throw new Error('Not enough stock available');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate before sending response
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock'
    );

    // NEW: log this cart activity
    logActivity({
      userId: req.user._id,
      productId: product._id,
      activityType: 'add_to_cart',
      categoryId: product.category,
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of an item in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const item = cart.items.find((item) => item.product.toString() === productId);

    if (!item) {
      res.status(404);
      throw new Error('Item not found in cart');
    }

    item.quantity = quantity;
    await cart.save();

    // FIXED: Populate product details so frontend receives full object
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock'
    );

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // FIXED: Populate product details so frontend receives full object
    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price images stock'
    );

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };