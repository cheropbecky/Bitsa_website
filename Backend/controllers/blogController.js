const Blog = require('../models/Blog');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error fetching blogs' });
  }
};

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const { title, author, category, content } = req.body;
    if (!title || !author || !content) {
      return res.status(400).json({ message: 'Title, author, and content are required' });
    }

    let imageData = null;
    if (req.file) {
      imageData = await uploadToCloudinary(req.file);
    }

    const blog = new Blog({
      title,
      author,
      category,
      content,
      image: imageData?.url || null,
      publicId: imageData?.publicId || null
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Server error creating blog' });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Delete image from Cloudinary if exists
    if (blog.publicId) {
      await deleteFromCloudinary(blog.publicId);
    }

    await blog.remove();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Server error deleting blog' });
  }
};

// UPDATE BLOG IMAGE
const updateBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    // Delete old image if exists
    if (blog.publicId) await deleteFromCloudinary(blog.publicId);

    const imageData = await uploadToCloudinary(req.file);
    blog.image = imageData.url;
    blog.publicId = imageData.publicId;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error('Error updating blog image:', err);
    res.status(500).json({ message: 'Server error updating blog image' });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlogImage
};
