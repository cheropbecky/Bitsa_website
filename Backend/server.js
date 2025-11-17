const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { verifyAdmin } = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// PORT
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// ⭐ CLOUDINARY CONFIG
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

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running with Cloudinary 🚀');
});

// ==============================
// ADMIN ROUTES
// ==============================

// Admin Login (PUBLIC - no auth needed)
app.post('/api/admin/login', async (req, res) => {
  console.log('======================================');
  console.log('🔐 Admin Login Attempt');
  console.log('======================================');
  
  try {
    const { email, password } = req.body;
    
    // Debug: Show what we received
    console.log('📧 Received Email:', email);
    console.log('🔑 Received Password:', password);
    console.log('📧 Expected Email:', 'admin@bitsa.com');
    console.log('🔑 Expected Password:', 'admin123');
    
    // Check exact matches
    console.log('Email Match:', email === 'admin@bitsa.com');
    console.log('Password Match:', password === 'admin123');
    
    // Trim whitespace (common issue)
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    
    console.log('📧 Trimmed Email:', trimmedEmail);
    console.log('🔑 Trimmed Password:', trimmedPassword);

    // For testing, use hardcoded admin credentials
    if (trimmedEmail === 'admin@bitsa.com' && trimmedPassword === 'admin123') {
      const token = jwt.sign(
        { email: trimmedEmail, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('🎫 Token Generated:', token.substring(0, 20) + '...');
      console.log('======================================\n');

      return res.json({ 
        token,
        message: 'Login successful' 
      });
    }

    console.log('❌ LOGIN FAILED - Invalid Credentials');
    console.log('======================================\n');
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('💥 Admin login error:', error);
    console.log('======================================\n');
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Admin Dashboard (requires auth)
app.get('/api/admin/dashboard', verifyAdmin, async (req, res) => {
  try {
    console.log('📊 Admin Dashboard Access');
    // Return dashboard data
    res.json({
      message: 'Welcome to admin dashboard',
      admin: req.admin
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Get All Users (requires auth)
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const User = require('./models/User'); // Make sure you have a User model
    const users = await User.find().select('-password'); // Don't send passwords
    
    res.json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error' 
  });
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