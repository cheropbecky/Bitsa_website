const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../upload');

// CREATE
router.post('/', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const gallery = new Gallery({ ...req.body, image: req.file?.filename });
    await gallery.save();
    res.status(201).json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
