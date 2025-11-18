// controllers/eventController.js
const Event = require('../models/Event');
const mongoose = require('mongoose');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Helper: determine event status automatically
const getEventStatus = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  if (event.toDateString() === now.toDateString()) return 'Ongoing';
  if (event > now) return 'Upcoming';
  return 'Past';
};

// GET all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate('registeredUsers', 'name email');

    const eventsWithStatus = events.map(event => ({
      ...event.toObject(),
      status: event.status || getEventStatus(event.date)
    }));

    res.json(eventsWithStatus);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error fetching events', error: err.message });
  }
};

// GET event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredUsers', 'name email');

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json({ ...event.toObject(), status: event.status || getEventStatus(event.date) });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error fetching event', error: err.message });
  }
};

// CREATE event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, status } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description, and date are required' });
    }

    let imageData = null;
    if (req.file) {
      try {
        imageData = await uploadToCloudinary(req.file.buffer);
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Image upload failed', error: err.message });
      }
    }

    const allowedStatus = ['Upcoming', 'Ongoing', 'Past'];
    const eventStatus = allowedStatus.includes(status) ? status : getEventStatus(date);

    const event = new Event({
      title,
      description,
      date,
      location: location || "",
      status: eventStatus,
      imageUrl: imageData?.url || null,
      publicId: imageData?.publicId || null,
      registeredUsers: []
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error creating event', error: err.message });
  }
};

// UPDATE event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date, location, status } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;

    const allowedStatus = ['Upcoming', 'Ongoing', 'Past'];
    if (status && allowedStatus.includes(status)) event.status = status;

    if (req.file) {
      try {
        if (event.publicId) await deleteFromCloudinary(event.publicId);
        const imageData = await uploadToCloudinary(req.file.buffer);
        event.imageUrl = imageData.url;
        event.publicId = imageData.publicId;
      } catch (err) {
        console.error('Cloudinary update error:', err);
        return res.status(500).json({ message: 'Image update failed', error: err.message });
      }
    }

    await event.save();
    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: 'Server error updating event', error: err.message });
  }
};

// DELETE event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

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

// REGISTER FOR EVENT
const registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('registeredUsers', '_id');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // Convert to ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Safe duplicate check
    const alreadyRegistered = event.registeredUsers.some(
      u => u._id?.toString() === userId || u.toString() === userId
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'User already registered' });
    }

    event.registeredUsers.push(userObjectId);
    await event.save();

    res.json({ message: 'User registered successfully', event });
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
  registerEvent
};
