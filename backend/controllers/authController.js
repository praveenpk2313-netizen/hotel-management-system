const crypto                           = require('crypto');
const User                             = require('../models/User');
const generateToken                    = require('../utils/generateToken');
const { sendNotification }             = require('../utils/socket');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determine the correct role for an email address.
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
 * Build the safe user response object.
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
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, username, mobileNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Role detection
    let assignedRole = getRoleForEmail(email);
    if (assignedRole === 'customer' && req.body.role && ['manager', 'admin'].includes(req.body.role)) {
       assignedRole = req.body.role;
    }

    // Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      password,
      username:     username ? username.trim() : undefined,
      mobileNumber: mobileNumber ? mobileNumber.trim() : undefined,
      role:         assignedRole,
      isVerified:   false,
      verificationToken,
      verificationTokenExpires,
    });

    // Send Verification Email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
      // We don't fail registration if email fails, but maybe we should?
      // For now, user can request a resend (todo) or we just log it.
    }

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      sendNotification({
        userId: admin._id,
        title: "New User Registered 👤",
        message: `${user.name} has joined as ${user.role}. Verification email sent.`,
        type: 'system',
        metaData: { userId: user._id }
      });
    });

    return res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      user: buildUserResponse(user) 
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Verify Email
 * @route   GET /api/auth/verify/:token
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    return res.status(500).json({ message: 'Email verification failed.' });
  }
};

/**
 * @desc    Login user & get token
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

    if (!user.isVerified) {
       return res.status(401).json({ message: 'Please verify your email address before logging in.' });
    }

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
 * @desc    Forgot Password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'Account not found with this email.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user.email, user.name, resetToken);

    return res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      message: 'Email service error. Please try again later.',
      details: error.message 
    });
  }
};

/**
 * @desc    Reset Password
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Password reset failed.' });
  }
};

/**
 * @desc    Logout user
 */
const logoutUser = (_req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc    Get profile
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(buildUserResponse(user));
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * @desc    Update profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, username, mobileNumber, password, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber.trim();

    if (username && username !== user.username) {
      const exists = await User.findOne({ username: username.trim() });
      if (exists) return res.status(400).json({ message: 'Username is already taken' });
      user.username = username.trim();
    }

    if (newPassword) {
      if (!password) return res.status(400).json({ message: 'Current password is required' });
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    const updated = await user.save();
    return res.json(buildUserResponse(updated));
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  authUser,
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
