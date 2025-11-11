import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  description: String,
  image: String,
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
