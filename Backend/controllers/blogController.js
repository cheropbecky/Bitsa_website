// controllers/blogController.js
const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    let imageUrl = '';
    let publicId = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blogs' });
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const blog = await Blog.create({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      content: req.body.content,
      imageUrl,
      publicId
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Remove image from Cloudinary
    if (blog.publicId) await cloudinary.uploader.destroy(blog.publicId);

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE BLOG IMAGE (optional)
exports.updateBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (req.file) {
      if (blog.publicId) await cloudinary.uploader.destroy(blog.publicId);
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'blogs' });
      blog.imageUrl = result.secure_url;
      blog.publicId = result.public_id;
      await blog.save();
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
