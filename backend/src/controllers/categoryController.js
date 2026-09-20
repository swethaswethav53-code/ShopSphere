const Category = require('../models/category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please provide a category name');
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description ?? category.description;

    const updatedCategory = await category.save();
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };