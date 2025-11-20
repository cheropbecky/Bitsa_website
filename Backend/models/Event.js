const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Ongoing', 'Past'], 
    default: 'Upcoming' 
  },
  imageUrl: { type: String },
  publicId: { type: String },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
