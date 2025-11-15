const Event = require("../models/Event");

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json({ events });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single event
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: "Event not found" });

        res.json({ event });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create event (admin)
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ message: "Event created", event });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Register user for event
exports.registerEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event)
            return res.status(404).json({ message: "Event not found" });

        // Check if already registered
        if (event.registeredUsers.includes(req.user._id)) {
            return res
                .status(400)
                .json({ message: "You already registered for this event" });
        }

        event.registeredUsers.push(req.user._id);
        await event.save();

        res.json({ message: "Successfully registered for event" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
