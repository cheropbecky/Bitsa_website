// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: '' },
  imageUrl: { type: String },
  publicId: { type: String },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // NEW
});

module.exports = mongoose.model('Event', eventSchema);
