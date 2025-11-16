const Gallery = require("../models/Gallery");

exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addGalleryItem = async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body;
    const item = await Gallery.create({ title, imageUrl, description });
    res.status(201).json({ message: "Gallery item added", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json({ message: "Gallery item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
