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
    const { title, author, category, content, imageUrl } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ message: "Title, author, and content are required" });
    }

    let imageData = null;

    if (req.file) {
      imageData = await uploadToCloudinary(req.file.buffer);
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

// UPDATE BLOG (Handles text and optional image update/removal)
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category, content, imageUrl } = req.body;
        
        if (!title || !author || !content) {
            return res.status(400).json({ message: "Title, author, and content are required" });
        }

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        blog.title = title;
        blog.author = author;
        blog.category = category;
        blog.content = content;

        let newImagePublicId = blog.publicId;
        let newImageUrl = blog.imageUrl;

        // Image Update Logic
        if (req.file) {
            // New file uploaded: Delete old image, upload new one
            if (blog.publicId) await deleteFromCloudinary(blog.publicId);
            
            const imageData = await uploadToCloudinary(req.file.buffer);
            newImageUrl = imageData.url;
            newImagePublicId = imageData.publicId;

        } else if (imageUrl) {
            // Image URL provided: Use URL, remove publicId if present
            if (blog.publicId) await deleteFromCloudinary(blog.publicId);
            
            newImageUrl = imageUrl;
            newImagePublicId = null;
            
        } else if (blog.publicId) {
            // Image cleared: No file or URL provided, but an old Cloudinary image exists
            await deleteFromCloudinary(blog.publicId);
            newImageUrl = null;
            newImagePublicId = null;
        }

        blog.imageUrl = newImageUrl;
        blog.publicId = newImagePublicId;

        await blog.save();
        res.status(200).json(blog);

    } catch (err) {
        console.error("Error updating blog:", err);
        res.status(500).json({ message: "Server error updating blog", error: err.message });
    }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete image from Cloudinary if it exists
    if (blog.publicId) await deleteFromCloudinary(blog.publicId);

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Server error deleting blog", error: err.message });
  }
};

// GET ONE BLOG
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Error fetching single blog:", err);
    res.status(500).json({ message: "Server error fetching blog" });
  }
};

// UPDATE BLOG IMAGE (Can be removed, as updateBlog now handles it)
const updateBlogImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    // Delete old image
    if (blog.publicId) await deleteFromCloudinary(blog.publicId);

    // Upload new image
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

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog, updateBlogImage, getBlog };