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

// --- 🔑 NEW: UPDATE BLOG (Full Update, including text and image) 🔑 ---
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category, content, imageUrl } = req.body;
        
        // 1. Validate required fields
        if (!title || !author || !content) {
            return res.status(400).json({ message: "Title, author, and content are required" });
        }

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // 2. Prepare update data
        blog.title = title;
        blog.author = author;
        blog.category = category;
        blog.content = content;

        let newImagePublicId = blog.publicId;

        // 3. Handle image update logic
        if (req.file) {
            // A. New file uploaded: Delete old image, upload new one
            if (blog.publicId) await deleteFromCloudinary(blog.publicId);
            
            const imageData = await uploadToCloudinary(req.file.buffer);
            blog.imageUrl = imageData.url;
            newImagePublicId = imageData.publicId;

        } else if (imageUrl) {
            // B. Image URL provided: Use URL, remove publicId if present (since it's not a Cloudinary image)
            if (blog.publicId) await deleteFromCloudinary(blog.publicId);
            
            blog.imageUrl = imageUrl;
            newImagePublicId = null;
            
        } else if (blog.publicId && !blog.imageUrl) {
            // C. No image provided (and no URL), but an old Cloudinary image exists (user probably cleared the image)
            await deleteFromCloudinary(blog.publicId);
            blog.imageUrl = null;
            newImagePublicId = null;
        }

        blog.publicId = newImagePublicId;

        // 4. Save and return the updated blog
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

    if (blog.publicId) await deleteFromCloudinary(blog.publicId);

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Server error deleting blog", error: err.message });
  }
};

// GET ONE BLOG (Placeholder, often useful)
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


// NOTE: updateBlogImage is now largely redundant since updateBlog handles image updates, 
// but it is left for compatibility.
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

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog, updateBlogImage, getBlog };