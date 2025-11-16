const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

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
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();
