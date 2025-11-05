const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
  },
});

const aboutSchema = new mongoose.Schema(
  {
    // Church Info
    churchName: {
      type: String,
      default: "Grace Community Church",
    },
    tagline: {
      type: String,
      default: "A Place of Faith, Hope, and Love",
    },
    heroImage: {
      type: String,
    },

    // Our Story
    storyTitle: {
      type: String,
      default: "Our Story",
    },
    storyContent: {
      type: String,
      default: "",
    },
    storyImage: {
      type: String,
    },

    // Mission & Vision
    missionTitle: {
      type: String,
      default: "Our Mission",
    },
    missionContent: {
      type: String,
      default: "",
    },
    missionImage: {
      type: String,
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
    },
    visionContent: {
      type: String,
      default: "",
    },
    visionImage: {
      type: String,
    },

    // Core Values (array of objects)
    coreValues: [
      {
        title: String,
        description: String,
        icon: String, // Icon name from react-icons or image URL
      },
    ],

    // Leadership Team
    leaders: [leaderSchema],

    // Stats
    foundedYear: {
      type: Number,
      default: 1985,
    },
    memberCount: {
      type: String,
      default: "500+",
    },
    ministriesCount: {
      type: String,
      default: "15+",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);
