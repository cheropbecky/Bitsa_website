const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  const blog = new Blog({ ...req.body, image: req.file?.filename });
  await blog.save();
  res.json(blog);
});

router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  const updatedData = { ...req.body };
  if (req.file) updatedData.image = req.file.filename;
  const blog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  res.json(blog);
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
