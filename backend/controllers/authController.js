const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper ──────────────────────────────────────────────────────────────────

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output (it's already select:false but just in case)
  user.password = undefined;

  res.status(statusCode).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password, role? }
 *
 * Creates a new user and returns a JWT.
 * The user is automatically saved to the database on registration.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role });

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Validates credentials and returns a JWT.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Explicitly select password since it has select:false on the schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact an admin.' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get current user ────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 * Protected — requires valid Bearer token.
 *
 * Returns the currently authenticated user's profile.
 */
exports.currUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── List all users (admin only) ─────────────────────────────────────────────

/**
 * GET /api/auth/users
 * Protected + admin only.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update user (admin only) ────────────────────────────────────────────────

/**
 * PUT /api/auth/users/:id
 * Protected + admin only.
 * Can update name, role, isActive. Password changes handled separately.
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── Delete user (admin only) ────────────────────────────────────────────────

/**
 * DELETE /api/auth/users/:id
 * Protected + admin only.
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `User "${user.name}" deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
