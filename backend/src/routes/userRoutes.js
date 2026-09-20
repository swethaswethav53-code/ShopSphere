const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;