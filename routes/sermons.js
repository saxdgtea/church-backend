const express = require("express");
const router = express.Router();
const Sermon = require("../models/Sermon");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getImageUrl } = require("../config/config");

// Helper function to format sermon with full image URL
const formatSermon = (sermon) => {
  const sermonObj = sermon.toObject ? sermon.toObject() : sermon;
  return {
    ...sermonObj,
    image: getImageUrl(sermonObj.image),
  };
};

// @route   GET /api/sermons
// @desc    Get all sermons
// @access  Public
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const sermons = await Sermon.find().sort({ date: -1 }).limit(limit);
    const formattedSermons = sermons.map(formatSermon);
    res.json(formattedSermons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/sermons/:id
// @desc    Get single sermon
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }
    res.json(formatSermon(sermon));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/sermons/:id/like
// @desc    Toggle like on sermon (increment or decrement)
// @access  Public
router.post("/:id/like", async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    const { isLiked } = req.body;

    if (isLiked) {
      sermon.likes += 1;
    } else {
      sermon.likes = Math.max(0, sermon.likes - 1);
    }

    await sermon.save();
    res.json({ likes: sermon.likes, message: "Like updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/sermons
// @desc    Create sermon
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const sermonData = {
      title: req.body.title,
      date: req.body.date,
      scripture: req.body.scripture,
      description: req.body.description,
      youtubeUrl: req.body.youtubeUrl,
      likes: 0,
    };

    if (req.file) {
      sermonData.image = "/uploads/sermons/" + req.file.filename;
    }

    const sermon = new Sermon(sermonData);
    const savedSermon = await sermon.save();
    res.status(201).json(formatSermon(savedSermon));
  } catch (error) {
    console.error("Error creating sermon:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/sermons/:id
// @desc    Update sermon
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }

    const updateData = {
      title: req.body.title,
      date: req.body.date,
      scripture: req.body.scripture,
      description: req.body.description,
      youtubeUrl: req.body.youtubeUrl,
    };

    if (req.file) {
      updateData.image = "/uploads/sermons/" + req.file.filename;
    }

    const updatedSermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(formatSermon(updatedSermon));
  } catch (error) {
    console.error("Error updating sermon:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/sermons/:id
// @desc    Delete sermon
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);
    if (!sermon) {
      return res.status(404).json({ message: "Sermon not found" });
    }
    res.json({ message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
