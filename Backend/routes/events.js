const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
} = require('../controllers/eventsController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../upload'); // for image uploads

// CREATE event (admin only)
router.post('/', protect, isAdmin, upload.single('image'), createEvent);

// GET all events
router.get('/', getEvents);

// GET single event
router.get('/:id', getEventById);

// UPDATE event (admin only)
router.put('/:id', protect, isAdmin, upload.single('image'), updateEvent);

// DELETE event (admin only)
router.delete('/:id', protect, isAdmin, deleteEvent);

// OPTIONAL: register current user for event
router.post('/:id/register', protect, registerEvent);

module.exports = router;
