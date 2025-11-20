const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });


router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json({ count: users.length, users });
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('GET /profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;
    const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

    if (req.body.email) user.email = req.body.email.trim().toLowerCase();

    
    if (req.file) {
      try {
        
        if (user.photo && user.photo.includes('cloudinary')) {
          const publicIdMatch = user.photo.match(/\/v\d+\/(.+)\./);
          if (publicIdMatch) {
            await deleteFromCloudinary(publicIdMatch[1]);
          }
        }
        const imageData = await uploadToCloudinary(req.file.buffer, 'bitsa_profiles');
        user.photo = imageData.url;
      } catch (uploadErr) {
        console.error('Photo upload error:', uploadErr);
        return res.status(500).json({ message: 'Failed to upload profile picture' });
      }
    }

    await user.save();
    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('PUT /profile error:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, studentId, course, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const newUser = new User({
      name,
      email,
      password, 
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
router.post('/login', async (req, res) => {
  console.log('=========================');
  console.log('User Login Attempt');
  console.log('Request Body:', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Invalid password for user:', email);
      
      return res.status(400).json({ 
        message: 'Invalid credentials. If you registered before recent updates, please reset your password or contact support.' 
      });
    }
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
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (err) {
    console.error('POST /reset-password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/fix-email', async (req, res) => {
  try {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
      return res.status(400).json({ message: 'Both old and new email are required' });
    }

    const user = await User.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json({ message: 'User with old email not found' });
    }
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'New email already exists' });
    }
    user.email = newEmail;
    await user.save();

    res.json({ 
      message: 'Email updated successfully', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('POST /fix-email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
