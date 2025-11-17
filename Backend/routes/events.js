// routes/events.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  registerEvent 
} = require('../controllers/eventController');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// -------------------- Multer Setup --------------------
const storage = multer.memoryStorage(); // store files in memory
const upload = multer({ storage });

// -------------------- Routes --------------------

// GET all events
router.get('/', async (req, res) => {
  console.log('[DEBUG] GET /api/events hit');
  try {
    await getEvents(req, res);
  } catch (err) {
    console.error('[ERROR] GET /api/events:', err);
    res.status(500).json({ message: 'Server error fetching events', error: err.message });
  }
});

// GET event by ID
router.get('/:id', async (req, res) => {
  console.log(`[DEBUG] GET /api/events/${req.params.id} hit`);
  try {
    await getEventById(req, res);
  } catch (err) {
    console.error(`[ERROR] GET /api/events/${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error fetching event', error: err.message });
  }
});

// CREATE event
router.post('/', upload.single('image'), async (req, res) => {
  console.log('[DEBUG] POST /api/events hit');
  console.log('[DEBUG] req.body:', req.body);
  console.log('[DEBUG] req.file:', req.file);

  try {
    let imageData = null;
    if (req.file) {
      console.log('[DEBUG] Uploading file to Cloudinary...');
      imageData = await uploadToCloudinary(req.file); // expects buffer/file
      console.log('[DEBUG] Cloudinary result:', imageData);
    }

    await createEvent({ ...req, body: { ...req.body, imageData } }, res);
  } catch (err) {
    console.error('[ERROR] Failed to create event:', err);
    res.status(500).json({ message: 'Server error creating event', error: err.message });
  }
});

// UPDATE event
router.put('/:id', upload.single('image'), async (req, res) => {
  console.log(`[DEBUG] PUT /api/events/${req.params.id} hit`);
  console.log('[DEBUG] req.body:', req.body);
  console.log('[DEBUG] req.file:', req.file);

  try {
    let imageData = null;
    if (req.file) {
      console.log('[DEBUG] Uploading updated file to Cloudinary...');
      imageData = await uploadToCloudinary(req.file);
      console.log('[DEBUG] Cloudinary result:', imageData);
    }

    await updateEvent({ ...req, body: { ...req.body, imageData } }, res);
  } catch (err) {
    console.error(`[ERROR] Failed to update event ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error updating event', error: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  console.log(`[DEBUG] DELETE /api/events/${req.params.id} hit`);
  try {
    await deleteEvent(req, res);
  } catch (err) {
    console.error(`[ERROR] Failed to delete event ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error deleting event', error: err.message });
  }
});

// REGISTER for event
router.post('/:id/register', async (req, res) => {
  console.log(`[DEBUG] POST /api/events/${req.params.id}/register hit`);
  try {
    await registerEvent(req, res);
  } catch (err) {
    console.error(`[ERROR] Failed to register for event ${req.params.id}:`, err);
    res.status(500).json({ message: 'Server error registering for event', error: err.message });
  }
});

module.exports = router;
