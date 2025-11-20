const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  deleteBlog,
  updateBlogImage,
  getAllBlogs,
  updateBlog, 
} = require("../controllers/blogController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllBlogs);

router.post("/", verifyAdmin, upload.single("image"), createBlog);

router.put("/:id", verifyAdmin, upload.single("image"), updateBlog); 

router.delete("/:id", verifyAdmin, deleteBlog);

router.put("/:id/image", verifyAdmin, upload.single("image"), updateBlogImage);


module.exports = router;