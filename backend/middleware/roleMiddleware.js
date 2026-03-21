/**
 * Role-Based Access Control Middleware
 *
 * Usage:
 *   router.get('/admin-only', protect, authorize('admin'), handler);
 *   router.get('/staff',      protect, authorize('manager', 'admin'), handler);
 */

/**
 * authorize(...roles) — factory that returns a middleware allowing
 * only users whose role is in the provided list.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Role authorization failed: no req.user');
      return res.status(401).json({ message: 'Not authorized — please log in' });
    }
    
    console.log(`Checking role: user has '${req.user.role}', requires one of: ${roles.join(', ')}`);
    
    if (!roles.includes(req.user.role)) {
      console.log('Role authorization failed.');
      return res.status(403).json({
        message: `Access denied — requires role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

// ── Named shortcuts for convenience & backward compatibility ─────────────────

/** Allow only admins */
const admin = authorize('admin');

/** Allow managers AND admins */
const manager = authorize('manager', 'admin');

/** Allow all authenticated users (customer / manager / admin) */
const customer = authorize('customer', 'manager', 'admin');

module.exports = { authorize, admin, manager, customer };
