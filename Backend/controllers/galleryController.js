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
    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      // Upload file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "bitsa_gallery" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    } else if (req.body.imageUrl) {
      // If user provides an image URL instead of uploading a file
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: "No image uploaded or URL provided" });
    }

    const newItem = await Gallery.create({
      title: req.body.title || "Untitled",
      description: req.body.description || "",
      imageUrl,
      publicId,
    });

    res.status(201).json({ message: "Gallery item added", item: newItem });
  } catch (err) {
    console.error("Error adding gallery item:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE gallery item (admin)
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    // Delete image from Cloudinary if exists
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
