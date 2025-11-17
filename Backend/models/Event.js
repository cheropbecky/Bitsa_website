const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  date: { type: Date },
  imageUrl: { type: String },         // URL of Cloudinary or manual
  cloudinaryId: { type: String },     // store public_id to delete later
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
