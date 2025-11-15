const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); // middleware to protect routes

const JWT_SECRET = 'your_jwt_secret'; // ideally move to .env

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password, studentId, course, year } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const newUser = new User({
      name,
      email,
      password, // hashed in pre-save hook
      studentId: studentId || '',
      course: course || '',
      year: year || '',
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.studentId,
        course: newUser.course,
        year: newUser.year,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        course: user.course,
        year: user.year,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
