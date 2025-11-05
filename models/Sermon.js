const mongoose = require("mongoose");

const sermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    scripture: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    youtubeUrl: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sermon", sermonSchema);
