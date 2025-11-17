const Blog = require("../models/Blog");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Server error fetching blogs" });
  }
};

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { title, author, category, content, imageUrl } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ message: "Title, author, and content are required" });
    }

    let imageData = null;

    // Upload to Cloudinary if file exists
    if (req.file) {
      imageData = await uploadToCloudinary(req.file.buffer);
      console.log("Image uploaded:", imageData);
    } else if (imageUrl) {
      imageData = { url: imageUrl, publicId: null };
    }

    const blog = new Blog({
      title,
      author,
      category,
      content,
      imageUrl: imageData?.url || null,
      publicId: imageData?.publicId || null,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Server error creating blog", error: err.message });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.publicId) await deleteFromCloudinary(blog.publicId);

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Server error deleting blog", error: err.message });
  }
};

// UPDATE BLOG IMAGE
const updateBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    if (blog.publicId) await deleteFromCloudinary(blog.publicId);

    const imageData = await uploadToCloudinary(req.file.buffer);

    blog.imageUrl = imageData.url;
    blog.publicId = imageData.publicId;
    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error("Error updating blog image:", err);
    res.status(500).json({ message: "Server error updating blog image", error: err.message });
  }
};

module.exports = { getAllBlogs, createBlog, deleteBlog, updateBlogImage };
