const express = require("express");
const router = express.Router();

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Log the contact form submission
    console.log("Contact Form Submission:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    console.log("Timestamp:", new Date().toISOString());

    // In production, you would:
    // 1. Send an email notification
    // 2. Store in database
    // 3. Integrate with CRM

    res.json({
      message: "Thank you for your message. We will get back to you soon!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
