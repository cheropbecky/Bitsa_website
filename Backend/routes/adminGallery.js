const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Gallery = require("../models/Gallery");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/gallery", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    // Upload buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "bitsa_gallery" },
      async (err, result) => {
        if (err) {
          console.error("Cloudinary Upload Error:", err);
          return res.status(500).json({ message: "Error uploading to Cloudinary" });
        }

        // Save to DB
        const newImage = await Gallery.create({
          title: req.body.title,
          description: req.body.description,
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });

        res.status(201).json(newImage);
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
