// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

const upload = multer({ storage });

// -------------------- Routes --------------------

// GET all users (admin-only maybe later)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json({ count: users.length, users });
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET logged-in user's profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('GET /profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE logged-in user's profile (email + photo)
router.put('/profile', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;

    if (req.body.email) user.email = req.body.email;
    if (req.file) user.photo = `/uploads/${req.file.filename}`;

    await user.save();
    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('PUT /profile error:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// POST register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, studentId, course, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      studentId,
      course,
      year,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('POST /register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST login a user
router.post('/login', async (req, res) => {
  console.log('=========================');
  console.log('User Login Attempt');
  console.log('Request Body:', req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        course: user.course,
        year: user.year,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error('POST /login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
