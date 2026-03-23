const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');

const {
  authUser,
  registerUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  logoutUser,
} = require('../controllers/authController');

const { protect  } = require('../middleware/authMiddleware');

// ─── Rate Limiters ────────────────────────────────────────────────────────────
// ... (omitted for brevity in replace call, but I will make it complete)
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, 
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { message: 'Too many attempts. Please try again in 15 minutes.' },
  skip:            () => process.env.NODE_ENV === 'development',
});

// ─── Public Routes ────────────────────────────────────────────────────────────

router.post('/register', authLimiter, registerUser);
router.post('/login',    authLimiter, authUser);
router.post('/logout',   logoutUser);

// NEW: Verification and Password Recovery
router.get('/verify-email/:token',  verifyEmail);
router.post('/forgot-password',     authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

// ─── Protected Routes (require valid JWT) ─────────────────────────────────────
// ...
router.get('/profile',   protect, getUserProfile);
router.put('/profile',   protect, updateUserProfile);

module.exports = router;
