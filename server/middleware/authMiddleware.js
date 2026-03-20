const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc  Verifies the Bearer JWT in the Authorization header.
 *        On success, attaches `req.user` (without password) and calls next().
 *        On failure, returns 401 with a descriptive message.
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized — user no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated — contact support' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired — please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token — please log in again' });
    }
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized — token verification failed' });
  }
};

module.exports = { protect };
