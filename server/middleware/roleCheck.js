// server/middleware/roleCheck.js

// Require a specific role (e.g., 'admin')
function requireRole(role) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      if (req.user.role !== role) {
        return res.status(403).json({ error: `${role} access required` });
      }
      next();
    };
  }
  
  // Shortcut for admin role
  function requireAdmin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }
  
  // Shortcut for regular user role
  function requireUser(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'User access required' });
    }
    next();
  }
  
  module.exports = {
    requireRole,
    requireAdmin,
    requireUser
  };  