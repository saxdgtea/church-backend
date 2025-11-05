const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const events = await Event.find().sort({ date: -1 }).limit(limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/events
// @desc    Create event
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      description: req.body.description,
    };

    if (req.file) {
      eventData.image = "/uploads/events/" + req.file.filename;
    }

    const event = new Event(eventData);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = "/uploads/events/" + req.file.filename;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
