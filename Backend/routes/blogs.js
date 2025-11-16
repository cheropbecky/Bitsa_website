// routes/blogs.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // temporary storage
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createBlog,
  deleteBlog,
  updateBlogImage,
  getAllBlogs
} = require('../controllers/blogController');

// GET ALL BLOGS
router.get('/', getAllBlogs);

// CREATE BLOG (admin only)
router.post('/', protect, isAdmin, upload.single('image'), createBlog);

// DELETE BLOG (admin only)
router.delete('/:id', protect, isAdmin, deleteBlog);

// UPDATE BLOG IMAGE (admin only)
router.put('/:id/image', protect, isAdmin, upload.single('image'), updateBlogImage);

module.exports = router;
