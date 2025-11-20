const Gallery = require("../models/Gallery");
// Assuming these are the helper functions used in other controllers
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary"); 

// GET all gallery items
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching gallery:", err);
    res.status(500).json({ message: "Server error fetching gallery" });
  }
};

// ADD gallery item (admin)
exports.addGalleryItem = async (req, res) => {
  try {
    const { title, description, imageUrl: externalUrl } = req.body;
    let imageData = null;

    if (req.file) {
      // Upload file to Cloudinary using helper
      imageData = await uploadToCloudinary(req.file.buffer, "bitsa_gallery");
    } else if (externalUrl) {
      // If user provides an image URL instead of uploading a file
      imageData = { url: externalUrl, publicId: null };
    } else {
      return res.status(400).json({ message: "No image uploaded or URL provided" });
    }

    const newItem = await Gallery.create({
      title: title || "Untitled",
      description: description || "",
      imageUrl: imageData.url,
      publicId: imageData.publicId,
    });

    res.status(201).json({ message: "Gallery item added", item: newItem });
  } catch (err) {
    console.error("Error adding gallery item:", err);
    res.status(500).json({ message: "Server error adding gallery item" });
  }
};


exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl: externalUrl } = req.body;

    const item = await Gallery.findById(id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    // Update text fields
    if (title) item.title = title;
    if (description) item.description = description;

    let newImagePublicId = item.publicId;
    let newImageUrl = item.imageUrl;

    // Handle image update/replacement
    if (req.file) {
      // New file uploaded: Delete old image, upload new one
      if (item.publicId) await deleteFromCloudinary(item.publicId);

      const imageData = await uploadToCloudinary(req.file.buffer, "bitsa_gallery");
      newImageUrl = imageData.url;
      newImagePublicId = imageData.publicId;

    } else if (externalUrl) {
      // External URL provided: Delete old Cloudinary image (if exists) and use new URL
      if (item.publicId) await deleteFromCloudinary(item.publicId);

      newImageUrl = externalUrl;
      newImagePublicId = null;
      
    } else if (!externalUrl && item.publicId) {
      // Image cleared by user (neither file nor URL provided, but old image exists)
      await deleteFromCloudinary(item.publicId);
      newImageUrl = null;
      newImagePublicId = null;
    }

    item.imageUrl = newImageUrl;
    item.publicId = newImagePublicId;

    await item.save();
    res.json({ message: "Gallery item updated", item });
  } catch (err) {
    console.error("Error updating gallery item:", err);
    res.status(500).json({ message: "Server error updating gallery item" });
  }
};

// DELETE gallery item (admin)
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    // Delete image from Cloudinary if exists
    if (item.publicId) {
      // Assuming deleteFromCloudinary uses cloudinary.uploader.destroy internally
      await deleteFromCloudinary(item.publicId); 
    }

    // Delete from DB
    await item.deleteOne();

    res.json({ message: "Gallery item removed" });
  } catch (err) {
    console.error("Error deleting gallery item:", err);
    res.status(500).json({ message: "Server error deleting gallery item" });
  }
};