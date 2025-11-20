const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { protect, verifyAdmin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
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

router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
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

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.publicId) await deleteFromCloudinary(event.publicId);
    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error deleting event', error: err.message });
  }
});

router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userId = req.user._id;

    const existingRegistration = await Registration.findOne({ 
      event: req.params.id, 
      user: userId 
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        message: 'You have already registered for this event',
        status: existingRegistration.status 
      });
    }

    const registration = new Registration({
      event: req.params.id,
      user: userId,
      status: 'Pending'
    });

    await registration.save();

    if (!event.registeredUsers.includes(userId)) {
      event.registeredUsers.push(userId);
      await event.save();
    }

    res.json({ 
      message: 'Registration submitted successfully. Awaiting admin approval.', 
      registration 
    });
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ message: 'Server error registering for event', error: err.message });
  }
});

router.get('/:id/registrations', verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registrations = await Registration.find({ event: req.params.id })
      .populate('user', 'name email studentId course year')
      .populate('reviewedBy', 'name email')
      .sort({ registeredAt: -1 });

    res.json({ 
      event: { id: event._id, title: event.title },
      count: registrations.length,
      registrations 
    });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Server error fetching registrations', error: err.message });
  }
});

router.put('/registrations/:registrationId/status', verifyAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
    }

    const registration = await Registration.findById(req.params.registrationId)
      .populate('user', 'name email')
      .populate('event', 'title');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    registration.reviewedAt = new Date();
    registration.reviewedBy = req.admin.id;
    if (notes) registration.notes = notes;

    await registration.save();

    res.json({ 
      message: `Registration ${status.toLowerCase()} successfully`, 
      registration 
    });
  } catch (err) {
    console.error('Error updating registration status:', err);
    res.status(500).json({ message: 'Server error updating registration', error: err.message });
  }
});

router.get('/user/registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title description date location status imageUrl')
      .sort({ registeredAt: -1 });

    res.json({ registrations });
  } catch (err) {
    console.error('Error fetching user registrations:', err);
    res.status(500).json({ message: 'Server error fetching registrations', error: err.message });
  }
});

module.exports = router;