const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Multer memory storage (required to upload buffer to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ==========================
// CREATE Gallery Item (Admin)
// ==========================
router.post("/", protect, isAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "bitsa_gallery" },
      async (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Save gallery item in MongoDB
        const newItem = await Gallery.create({
          title: req.body.title,
          description: req.body.description,
          imageUrl: result.secure_url,  // FULL URL for frontend
          publicId: result.public_id,   // optional for deletion
        });

        res.status(201).json({ message: "Gallery item added", item: newItem });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// READ ALL Gallery Items
// ==========================
router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// DELETE Gallery Item (Admin)
// ==========================
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    // Delete from Cloudinary if publicId exists
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
