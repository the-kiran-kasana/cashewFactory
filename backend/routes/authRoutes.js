const express = require('express');
const router = express.Router();
const {
  register,
  login,
  currUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/currentuser', protect, currUser);

// Admin-only user management
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.put('/users/:id', protect, restrictTo('admin'), updateUser);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router;
