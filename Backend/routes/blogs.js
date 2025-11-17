const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'temp/' }); // temp storage
const { verifyAdmin } = require('../middleware/authMiddleware');
const {
  createBlog,
  deleteBlog,
  updateBlogImage,
  getAllBlogs
} = require('../controllers/blogController');

// GET ALL BLOGS (public)
router.get('/', getAllBlogs);

// CREATE BLOG (admin only)
router.post('/', verifyAdmin, upload.single('image'), createBlog);

// DELETE BLOG (admin only)
router.delete('/:id', verifyAdmin, deleteBlog);

// UPDATE BLOG IMAGE (admin only)
router.put('/:id/image', verifyAdmin, upload.single('image'), updateBlogImage);

module.exports = router;
