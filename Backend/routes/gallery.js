const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const { verifyAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;
    let publicId = null;

    if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "bitsa_gallery");
      imageUrl = result.url;
      publicId = result.publicId;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image file or URL required" });
    }

    const newItem = await Gallery.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl,
      publicId,
    });

    res.status(201).json({ message: "Gallery item added", item: newItem });
  } catch (err) {
    console.error("Gallery creation error:", err);
    res.status(500).json({ message: "Failed to add gallery item" });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    const { title, description, imageUrl } = req.body;

    if (title) item.title = title;
    if (description !== undefined) item.description = description;

    if (req.file) {
      if (item.publicId) {
        await deleteFromCloudinary(item.publicId);
      }
      
      const result = await uploadToCloudinary(req.file.buffer, "bitsa_gallery");
      item.imageUrl = result.url;
      item.publicId = result.publicId;
    } else if (imageUrl) {
      if (item.publicId) {
        await deleteFromCloudinary(item.publicId);
      }
      item.imageUrl = imageUrl;
      item.publicId = null;
    }

    await item.save();
    res.json({ message: "Gallery item updated", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    if (item.publicId) await deleteFromCloudinary(item.publicId);

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;