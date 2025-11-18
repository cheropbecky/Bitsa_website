// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// PORT
const PORT = process.env.PORT || 5500;

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// CLOUDINARY CONFIG
// ==============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Make Cloudinary available in req
app.use((req, res, next) => {
  req.cloudinary = cloudinary;
  next();
});

// ==============================
// ROUTES
// ==============================
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const galleryRoutes = require('./routes/gallery');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contact');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);

// ==============================
// ADMIN MIDDLEWARE
// ==============================
const { verifyAdmin } = require('./middleware/authMiddleware');

// ==============================
// ADMIN ROUTES
// ==============================

// Admin login (public)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (trimmedEmail === 'admin@bitsa.com' && trimmedPassword === 'admin123') {
      const token = jwt.sign(
        { email: trimmedEmail, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      return res.json({ token, message: 'Login successful' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard (protected)
app.get('/api/admin/dashboard', verifyAdmin, async (req, res) => {
  try {
    res.json({ message: 'Welcome to admin dashboard', admin: req.admin });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (protected)
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find().select('-password');
    res.json({ count: users.length, users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages (protected)
app.get('/api/admin/messages', verifyAdmin, async (req, res) => {
  try {
    const Message = require('./models/Message');
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ count: messages.length, messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// DEFAULT ROUTE
// ==============================
app.get('/', (req, res) => {
  res.send('API is running with Cloudinary 🚀');
});

// Catch-all for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ==============================
// DB CONNECTION + SERVER START
// ==============================
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully ✅');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
      console.log(`Admin login: POST http://localhost:${PORT}/api/admin/login`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();
