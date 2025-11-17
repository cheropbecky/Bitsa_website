// controllers/eventController.js
const Event = require('../models/Event');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error fetching events', error: err.message });
  }
};

// GET EVENT BY ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error fetching event', error: err.message });
  }
};

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description, and date are required' });
    }

    let imageData = null;

    if (req.file) {
      imageData = await uploadToCloudinary(req.file); // req.file.path if diskStorage
      // If using diskStorage, remove temp file
      if (req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Temp file delete error:', err);
        });
      }
    }

    const event = new Event({
      title,
      description,
      date,
      imageUrl: imageData?.url || null,
      publicId: imageData?.publicId || null,
    });

    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error creating event', error: err.message });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;

    // Handle image update
    if (req.file) {
      // Delete old image
      if (event.publicId) {
        try {
          await deleteFromCloudinary(event.publicId);
        } catch (err) {
          console.error('Old image deletion failed:', err);
        }
      }
      const imageData = await uploadToCloudinary(req.file);
      event.imageUrl = imageData.url;
      event.publicId = imageData.publicId;

      if (req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Temp file delete error:', err);
        });
      }
    }

    await event.save();
    res.json({ message: 'Event updated', event });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: 'Server error updating event', error: err.message });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Delete image from Cloudinary if it exists
    if (event.publicId) {
      try {
        await deleteFromCloudinary(event.publicId);
      } catch (err) {
        console.error('Cloudinary deletion error:', err);
      }
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error deleting event', error: err.message });
  }
};

// REGISTER FOR EVENT (example functionality)
const registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // This is just a stub. You can add user registration logic here
    res.json({ message: `User registered for event ${event._id}` });
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ message: 'Server error registering for event', error: err.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
};
