const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  const gallery = new Gallery({ ...req.body, image: req.file?.filename });
  await gallery.save();
  res.json(gallery);
});

router.get('/', async (req, res) => {
  const gallery = await Gallery.find();
  res.json(gallery);
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: 'Gallery item deleted' });
});

module.exports = router;
