const Blog = require("../models/Blog");

// Get all blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ blogs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single blog
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.json({ blog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create blog
exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json({ message: "Blog created", blog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.json({ message: "Blog updated", blog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.json({ message: "Blog removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
