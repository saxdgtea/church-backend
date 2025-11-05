const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema(
  {
    welcomeTitle: {
      type: String,
      default: "Welcome to Grace Community Church",
    },
    welcomeMessage: {
      type: String,
      default:
        "Join us as we worship, grow, and serve together in faith and love.",
    },
    missionStatement: {
      type: String,
      default:
        "To glorify God by making disciples of Jesus Christ who love God, love others, and serve the world through the power of the Holy Spirit.",
    },
    pastorMessage: {
      type: String,
      default: "",
    },
    pastorName: {
      type: String,
      default: "John Smith",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Homepage", homepageSchema);
