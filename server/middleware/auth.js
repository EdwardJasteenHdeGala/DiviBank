// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// Secret key (⚠️ in production, load from .env)
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// -------------------- AUTH MIDDLEWARE --------------------

// Verify JWT and attach user to request
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Require admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Generate JWT for a user
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '2h' }
  );
}

module.exports = {
  authenticate,
  requireAdmin,
  generateToken
};