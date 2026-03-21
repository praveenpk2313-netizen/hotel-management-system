const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');

const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
} = require('../controllers/authController');

const { protect  } = require('../middleware/authMiddleware');

// ─── Rate Limiters ────────────────────────────────────────────────────────────

/**
 * Strict limiter for login/register — 10 attempts per 15 minutes.
 * Skipped in development for convenience (set NODE_ENV=production to enforce).
 */
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { message: 'Too many attempts. Please try again in 15 minutes.' },
  skip:            () => process.env.NODE_ENV === 'development',
});

/**
 * Looser limiter for profile reads — 60 requests per minute.
 */
const profileLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      60,
  skip:     () => process.env.NODE_ENV === 'development',
});

// ─── Public Routes ────────────────────────────────────────────────────────────

// POST /api/auth/register — Hash password (bcrypt via pre-save hook), assign role from env allow-list
router.post('/register', authLimiter, registerUser);

// POST /api/auth/login   — Validate credentials, return JWT { userId, role }
router.post('/login',    authLimiter, authUser);

// POST /api/auth/logout  — Stateless; client clears the token
router.post('/logout',   logoutUser);

// ─── Protected Routes (require valid JWT) ─────────────────────────────────────

// GET  /api/auth/profile — Fetch currently logged-in user's profile
router.get('/profile',   profileLimiter, protect, getUserProfile);

// PUT  /api/auth/profile — Update name, username, mobile, or change password
router.put('/profile',   protect, updateUserProfile);

// ─── OAuth (Google & GitHub) ──────────────────────────────────────────────────
// OAuth entry-points and callbacks are mounted directly in app.js so they sit
// at /auth/google and /auth/github (outside the /api prefix).
// See server/app.js — passport.authenticate('google' | 'github', …)

module.exports = router;
