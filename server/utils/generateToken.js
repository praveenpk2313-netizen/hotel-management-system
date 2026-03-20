const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT access token.
 *
 * Payload contains:
 *   • userId  — MongoDB ObjectId (string)
 *   • role    — 'customer' | 'manager' | 'admin'
 *
 * @param {string} userId    - MongoDB ObjectId
 * @param {string} role      - User role
 * @param {string} [expiresIn] - Override default expiry (falls back to JWT_EXPIRES_IN env var, then '30d')
 * @returns {string} Signed JWT
 */
const generateToken = (userId, role, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const expiry = expiresIn || process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: expiry }
  );
};

module.exports = generateToken;
