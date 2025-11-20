// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();

const app = express();

// ==============================
// PORT
// ==============================
const PORT = process.env.PORT || 5500;

// ==============================
// MIDDLEWARE
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup to allow frontend URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*', // Frontend URL
    credentials: true,
  })
);

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
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === 'admin@bitsa.com' && trimmedPassword === 'admin123') {
      const token = jwt.sign(
        { email: trimmedEmail, role: 'admin' },
        process.env.JWT_SECRET,
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

// Protected admin routes
const {
  getDashboardMetrics,
  getAllUsers,
  deleteUser,
  getAllRegistrations
} = require('./controllers/adminController');

app.get('/api/admin/dashboard', verifyAdmin, async (req, res) => {
  res.json({ message: 'Welcome to admin dashboard', admin: req.admin });
});

app.get('/api/admin/dashboard/metrics', verifyAdmin, getDashboardMetrics);
app.get('/api/admin/users', verifyAdmin, getAllUsers);
app.delete('/api/admin/users/:id', verifyAdmin, deleteUser);
app.get('/api/admin/registrations', verifyAdmin, getAllRegistrations);
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
// DEFAULT ROUTES
// ==============================
app.get('/', (req, res) => {
  res.send('API is running 🚀');
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
// DATABASE + SERVER START
// ==============================
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected ✅');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
      console.log(`Frontend URL: ${process.env.CLIENT_URL}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();
