const express = require("express");
const router = express.Router();
const Ministry = require("../models/Ministry");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getImageUrl } = require("../config/config");

const formatMinistry = (ministry) => {
  const ministryObj = ministry.toObject ? ministry.toObject() : ministry;
  return {
    ...ministryObj,
    image: getImageUrl(ministryObj.image),
  };
};

// @route   GET /api/ministries
// @desc    Get all ministries
// @access  Public
router.get("/", async (req, res) => {
  try {
    const ministries = await Ministry.find().sort({ createdAt: -1 });
    const formattedMinistries = ministries.map(formatMinistry);
    res.json(formattedMinistries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/ministries/:id
// @desc    Get single ministry
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }
    res.json(formatMinistry(ministry));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ministries
// @desc    Create ministry
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const ministryData = {
      name: req.body.name,
      description: req.body.description,
      contact: req.body.contact,
    };

    if (req.file) {
      ministryData.image = "/uploads/ministries/" + req.file.filename;
    }

    const ministry = new Ministry(ministryData);
    const savedMinistry = await ministry.save();
    res.status(201).json(formatMinistry(savedMinistry));
  } catch (error) {
    console.error("Error creating ministry:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/ministries/:id
// @desc    Update ministry
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      contact: req.body.contact,
    };

    if (req.file) {
      updateData.image = "/uploads/ministries/" + req.file.filename;
    }

    const updatedMinistry = await Ministry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(formatMinistry(updatedMinistry));
  } catch (error) {
    console.error("Error updating ministry:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/ministries/:id
// @desc    Delete ministry
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const ministry = await Ministry.findByIdAndDelete(req.params.id);
    if (!ministry) {
      return res.status(404).json({ message: "Ministry not found" });
    }
    res.json({ message: "Ministry deleted successfully" });
  } catch (error) {
    console.error("Error deleting ministry:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
