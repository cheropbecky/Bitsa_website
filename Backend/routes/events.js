const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// CREATE event with optional image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newEvent = new Event({
      title,
      description,
      date: date ? new Date(date) : undefined,
      imageUrl,
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create event" });
  }
});

// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete event" });
  }
});

module.exports = router;
