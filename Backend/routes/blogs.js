const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  deleteBlog,
  updateBlogImage,
  getAllBlogs,
} = require("../controllers/blogController");

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public: Get all blogs
router.get("/", getAllBlogs);

// Admin: Create blog
router.post("/", verifyAdmin, upload.single("image"), createBlog);

// Admin: Delete blog
router.delete("/:id", verifyAdmin, deleteBlog);

// Admin: Update blog image
router.put("/:id/image", verifyAdmin, upload.single("image"), updateBlogImage);

module.exports = router;
