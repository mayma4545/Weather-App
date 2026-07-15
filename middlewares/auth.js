/**
 * Authentication & Authorization Middleware
 * Checks express-session for logged-in user before allowing access.
 */

/**
 * requireAuth — redirects unauthenticated users to /login.
 * Attaches req.session.userId and req.session.userRole.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  // API requests get 401, page requests get redirect
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  return res.redirect('/login');
}

/**
 * requireAdmin — must be Admin role.
 * Should be used AFTER requireAuth in the middleware chain.
 */
function requireAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'Admin') {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return res.redirect('/farmer/dashboard');
}

module.exports = { requireAuth, requireAdmin };
