// File: routes/contact.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// -------------------- SEND MESSAGE --------------------
router.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create new message
    const newMessage = await Message.create({ name, email, subject, message });
    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

// -------------------- GET ALL MESSAGES (ADMIN) --------------------
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
