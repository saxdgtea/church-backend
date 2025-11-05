const express = require("express");
const router = express.Router();
const About = require("../models/About");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// @route   GET /api/about
// @desc    Get about page content
// @access  Public
router.get("/", async (req, res) => {
  try {
    let about = await About.findOne();

    // Create default about page if not exists
    if (!about) {
      about = new About({
        storyContent:
          "Grace Community Church was founded in 1985 by a small group of believers who had a vision to create a welcoming community where people could encounter God's love and grow in their faith. What began as a handful of families meeting in a living room has grown into a vibrant congregation. Throughout our journey, we've remained committed to our core values of worship, fellowship, discipleship, ministry, and evangelism.",
        missionContent:
          "To glorify God by making disciples of Jesus Christ who love God, love others, and serve the world through the power of the Holy Spirit.",
        visionContent:
          "To be a Christ-centered community where every person is equipped to live out their faith, share the Gospel, and make a lasting impact for God's kingdom.",
        coreValues: [
          {
            title: "Worship",
            description:
              "We gather to glorify God through heartfelt praise and authentic worship.",
            icon: "FaPrayingHands",
          },
          {
            title: "Fellowship",
            description:
              "We build authentic relationships and support one another in Christian community.",
            icon: "FaUsers",
          },
          {
            title: "Discipleship",
            description:
              "We grow in our faith through Bible study, prayer, and spiritual formation.",
            icon: "FaBook",
          },
          {
            title: "Ministry",
            description:
              "We serve others using our God-given gifts and talents.",
            icon: "FaHandsHelping",
          },
          {
            title: "Evangelism",
            description:
              "We share the good news of Jesus Christ with our community and beyond.",
            icon: "FaBullhorn",
          },
          {
            title: "Prayer",
            description:
              "We seek God's guidance and power through consistent prayer.",
            icon: "FaHeart",
          },
        ],
        leaders: [
          {
            name: "Pastor John Smith",
            role: "Senior Pastor",
            bio: "Leading our church with vision and pastoral care since 2010. Pastor John holds an M.Div from Seminary and has a heart for discipleship and community outreach.",
            email: "pastor.john@gracechurch.com",
          },
          {
            name: "Rev. Sarah Johnson",
            role: "Associate Pastor",
            bio: "Overseeing worship ministries and community outreach programs. Rev. Sarah brings passion for worship and creative arts to our congregation.",
            email: "sarah.johnson@gracechurch.com",
          },
          {
            name: "Elder David Williams",
            role: "Elder Board Chairman",
            bio: "Providing spiritual guidance and leadership to our congregation. David has been a member since 1995 and serves with wisdom and grace.",
            email: "david.williams@gracechurch.com",
          },
        ],
      });
      await about.save();
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/about
// @desc    Update about page content (without images)
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    const updateData = {
      churchName: req.body.churchName,
      tagline: req.body.tagline,
      storyTitle: req.body.storyTitle,
      storyContent: req.body.storyContent,
      missionTitle: req.body.missionTitle,
      missionContent: req.body.missionContent,
      visionTitle: req.body.visionTitle,
      visionContent: req.body.visionContent,
      coreValues: req.body.coreValues,
      foundedYear: req.body.foundedYear,
      memberCount: req.body.memberCount,
      ministriesCount: req.body.ministriesCount,
    };

    let about = await About.findOne();

    if (!about) {
      about = new About(updateData);
    } else {
      Object.assign(about, updateData);
    }

    await about.save();
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/about/upload/hero
// @desc    Upload hero image
// @access  Private
router.post("/upload/hero", auth, upload.single("image"), async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    if (req.file) {
      about.heroImage = "/uploads/about/" + req.file.filename;
      await about.save();
    }

    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/about/upload/story
// @desc    Upload story image
// @access  Private
router.post("/upload/story", auth, upload.single("image"), async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    if (req.file) {
      about.storyImage = "/uploads/about/" + req.file.filename;
      await about.save();
    }

    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/about/upload/mission
// @desc    Upload mission image
// @access  Private
router.post(
  "/upload/mission",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      let about = await About.findOne();
      if (!about) {
        about = new About();
      }

      if (req.file) {
        about.missionImage = "/uploads/about/" + req.file.filename;
        await about.save();
      }

      res.json(about);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// @route   POST /api/about/upload/vision
// @desc    Upload vision image
// @access  Private
router.post(
  "/upload/vision",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      let about = await About.findOne();
      if (!about) {
        about = new About();
      }

      if (req.file) {
        about.visionImage = "/uploads/about/" + req.file.filename;
        await about.save();
      }

      res.json(about);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// @route   POST /api/about/leaders
// @desc    Add or update leader
// @access  Private
router.post("/leaders", auth, upload.single("image"), async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    const leaderData = {
      name: req.body.name,
      role: req.body.role,
      bio: req.body.bio,
      email: req.body.email,
    };

    if (req.file) {
      leaderData.image = "/uploads/about/leaders/" + req.file.filename;
    }

    if (req.body.leaderId) {
      // Update existing leader
      const leaderIndex = about.leaders.findIndex(
        (l) => l._id.toString() === req.body.leaderId
      );
      if (leaderIndex !== -1) {
        about.leaders[leaderIndex] = {
          ...about.leaders[leaderIndex].toObject(),
          ...leaderData,
        };
      }
    } else {
      // Add new leader
      about.leaders.push(leaderData);
    }

    await about.save();
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/about/leaders/:leaderId
// @desc    Delete leader
// @access  Private
router.delete("/leaders/:leaderId", auth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About page not found" });
    }

    about.leaders = about.leaders.filter(
      (l) => l._id.toString() !== req.params.leaderId
    );
    await about.save();

    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
