const User          = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendNotification } = require('../utils/socket');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determine the correct role for an email address.
 * ADMIN_EMAILS / MANAGER_EMAILS are comma-separated env vars.
 */
const getRoleForEmail = (email) => {
  const normalize = (list) =>
    (list || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

  const adminEmails   = normalize(process.env.ADMIN_EMAILS);
  const managerEmails = normalize(process.env.MANAGER_EMAILS);
  const lower         = email.trim().toLowerCase();

  if (adminEmails.includes(lower))   return 'admin';
  if (managerEmails.includes(lower)) return 'manager';
  return 'customer';
};

/**
 * Build the safe user response object (no password / __v).
 */
const buildUserResponse = (user) => ({
  _id:          user._id,
  name:         user.name,
  email:        user.email,
  username:     user.username     || null,
  mobileNumber: user.mobileNumber || null,
  role:         user.role,
  isVerified:   user.isVerified,
  avatar:       user.avatar       || null,
  createdAt:    user.createdAt,
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Role assignment rules (security-first):
 *  • If the email is in ADMIN_EMAILS   → admin
 *  • If the email is in MANAGER_EMAILS → manager
 *  • Otherwise always 'customer', regardless of what the client sends
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, username, mobileNumber } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // ── Duplicate email check ─────────────────────────────────────────────────
    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // ── Duplicate username check ──────────────────────────────────────────────
    if (username) {
      const usernameExists = await User.findOne({ username: username.trim() });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    // ── Role from server-side allow-list OR frontend request ─────────────────
    let assignedRole = getRoleForEmail(email);
    if (assignedRole === 'customer' && req.body.role && ['manager', 'admin'].includes(req.body.role)) {
       assignedRole = req.body.role;
    }

    const user = await User.create({
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      password,
      username:     username     ? username.trim()     : undefined,
      mobileNumber: mobileNumber ? mobileNumber.trim() : undefined,
      role:         assignedRole,
      isVerified:   false,
    });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      sendNotification({
        userId: admin._id,
        title: "New User Registered 👤",
        message: `${user.name} has joined as ${user.role}.`,
        type: 'system',
        metaData: { userId: user._id }
      });
    });

    return res.status(201).json({ ...buildUserResponse(user), token });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`,
      });
    }
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Account not found. Please register first.' });
    }

    // OAuth-only accounts don't have a local password
    if (!user.password && user.oauthProvider) {
      return res.status(401).json({
        message: 'This account was created via OAuth. Please sign in with Google or GitHub.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated — contact support.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked by an administrator.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    return res.json({ ...buildUserResponse(user), token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Logout user (stateless — client clears the token)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = (_req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get authenticated user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(buildUserResponse(user));
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * @desc    Update authenticated user's profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, username, mobileNumber, password, newPassword } = req.body;

    if (name)         user.name         = name.trim();
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber.trim();

    if (username && username !== user.username) {
      const exists = await User.findOne({ username: username.trim() });
      if (exists) return res.status(400).json({ message: 'Username is already taken' });
      user.username = username.trim();
    }

    // Password change — require old password
    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: 'Current password is required to set a new one' });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    const updated = await user.save();
    const token   = generateToken(updated._id, updated.role);

    return res.json({ ...buildUserResponse(updated), token });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
