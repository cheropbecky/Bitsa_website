const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Protect routes - only allow logged-in users with valid sessions
const protect = async (req, res, next) => {
  let token;

  // Get token from headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 🔹 Debug log: token received
    console.log('Token received:', token);

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Check if session exists in DB and not expired
    const session = await Session.findOne({ token });
    if (!session || new Date() > session.expiresAt) {
      console.log('Session not found or expired:', session);
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    // Attach user to request
    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Admin-only access
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = { protect, isAdmin };
