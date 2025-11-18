// routes/events.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- GET ALL EVENTS ----------------
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate('registeredUsers', 'name email');
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error fetching events', error: err.message });
  }
});

// ---------------- GET EVENT BY ID ----------------
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredUsers', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error fetching event', error: err.message });
  }
});

// ---------------- CREATE EVENT ----------------
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, location, status } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "Title, description, and date are required" });
    }

    let imageData = null;
    if (req.file) {
      imageData = await uploadToCloudinary(req.file.buffer);
    }

    const eventData = {
      title,
      description,
      date: new Date(date),
      location: location || "",
      status: status || "Upcoming",
      imageUrl: imageData?.url || null,
      publicId: imageData?.publicId || null,
      registeredUsers: []
    };

    const event = new Event(eventData);
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error creating event', error: err.message });
  }
});

// ---------------- UPDATE EVENT ----------------
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date, location, status } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = new Date(date);
    if (location) event.location = location;
    if (status) event.status = status;

    if (req.file) {
      if (event.publicId) await deleteFromCloudinary(event.publicId);
      const imageData = await uploadToCloudinary(req.file.buffer);
      event.imageUrl = imageData.url;
      event.publicId = imageData.publicId;
    }

    await event.save();
    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: 'Server error updating event', error: err.message });
  }
});

// ---------------- DELETE EVENT ----------------
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.publicId) await deleteFromCloudinary(event.publicId);
    await event.deleteOne(); // ✅ Fixed

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error deleting event', error: err.message });
  }
});

// ---------------- REGISTER FOR EVENT ----------------
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    event.registeredUsers.push(mongoose.Types.ObjectId(userId));
    await event.save();

    res.json({ message: 'Successfully registered', event });
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ message: 'Server error registering for event', error: err.message });
  }
});

module.exports = router;
