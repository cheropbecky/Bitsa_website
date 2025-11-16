const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

// GET all gallery items
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ADD gallery item (admin)
exports.addGalleryItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "bitsa_gallery" },
      async (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        // Save to DB
        const newItem = await Gallery.create({
          title: req.body.title,
          description: req.body.description,
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });

        res.status(201).json({ message: "Gallery item added", item: newItem });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE gallery item (admin)
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    // Delete image from Cloudinary
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    // Delete from DB
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: "Gallery item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
