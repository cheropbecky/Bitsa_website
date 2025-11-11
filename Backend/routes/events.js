const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// CREATE
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  const event = new Event({ ...req.body, image: req.file?.filename });
  await event.save();
  res.json(event);
});

// READ ALL
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// READ ONE
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
});

// UPDATE
router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  const updatedData = { ...req.body };
  if (req.file) updatedData.image = req.file.filename;
  const event = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  res.json(event);
});

// DELETE
router.delete('/:id', auth, isAdmin, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
});

module.exports = router;
