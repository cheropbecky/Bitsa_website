const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { auth, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../upload');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      image: req.file?.filename
    });
    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// READ all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// READ single blog
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// DELETE blog
router.delete('/:id',  async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
