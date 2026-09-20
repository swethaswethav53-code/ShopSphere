const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role (promote/demote admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role');
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent an admin from accidentally demoting themselves and losing access
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      res.status(400);
      throw new Error('You cannot remove your own admin role');
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own account');
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateUserRole, deleteUser };