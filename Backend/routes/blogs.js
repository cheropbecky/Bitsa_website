// File: src/routes/blogRoutes.js (or similar)

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  deleteBlog,
  updateBlogImage,
  getAllBlogs,
  // 🔑 IMPORTANT: Ensure updateBlog is imported here 
  updateBlog, 
} = require("../controllers/blogController");

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --------------------- PUBLIC ROUTES ---------------------

// GET all blogs
router.get("/", getAllBlogs);

// --------------------- ADMIN ROUTES (Requires verifyAdmin middleware) ---------------------

// Admin: Create blog (POST /)
router.post("/", verifyAdmin, upload.single("image"), createBlog);

// 🔑 Admin: Update full blog (PUT /:id)
// This handles both text fields and optional file/URL image updates.
router.put("/:id", verifyAdmin, upload.single("image"), updateBlog); 

// Admin: Delete blog (DELETE /:id)
router.delete("/:id", verifyAdmin, deleteBlog);

// Admin: Update blog image (PUT /:id/image) 
// This specific route is now redundant but kept for compatibility.
router.put("/:id/image", verifyAdmin, upload.single("image"), updateBlogImage);


module.exports = router;