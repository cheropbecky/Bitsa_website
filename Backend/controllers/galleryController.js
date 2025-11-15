const Gallery = require("../models/Gallery");

// Get all gallery items
exports.getGallery = async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json({ items });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get one gallery item
exports.getGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item)
            return res.status(404).json({ message: "Gallery item not found" });

        res.json({ item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add/upload new gallery item
exports.addGalleryItem = async (req, res) => {
    try {
        const { title, imageUrl, description } = req.body;

        const item = await Gallery.create({
            title,
            imageUrl,
            description,
        });

        res.status(201).json({
            message: "Gallery item added successfully",
            item,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!item)
            return res.status(404).json({ message: "Gallery item not found" });

        res.json({ message: "Gallery item updated", item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);

        if (!item)
            return res.status(404).json({ message: "Gallery item not found" });

        res.json({ message: "Gallery item removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};