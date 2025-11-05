const express = require("express");
const router = express.Router();
const Homepage = require("../models/Homepage");
const auth = require("../middleware/auth");

// @route   GET /api/homepage
// @desc    Get homepage content
// @access  Public
router.get("/", async (req, res) => {
  try {
    let homepage = await Homepage.findOne();

    // Create default homepage if not exists
    if (!homepage) {
      homepage = new Homepage();
      await homepage.save();
    }

    res.json(homepage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/homepage
// @desc    Update homepage content
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    const updateData = {
      welcomeTitle: req.body.welcomeTitle,
      welcomeMessage: req.body.welcomeMessage,
      missionStatement: req.body.missionStatement,
      pastorMessage: req.body.pastorMessage,
      pastorName: req.body.pastorName,
    };

    let homepage = await Homepage.findOne();

    if (!homepage) {
      homepage = new Homepage(updateData);
    } else {
      Object.assign(homepage, updateData);
    }

    await homepage.save();
    res.json(homepage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
