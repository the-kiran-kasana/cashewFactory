const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verifies the Bearer JWT in the Authorization header.
 * Attaches req.user (without password) on success.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorised, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised, token invalid or expired.' });
  }
};

/**
 * Restrict access to specific roles.
 * Usage: router.delete('/:id', protect, restrictTo('admin'), handler)
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
