const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getImageUrl } = require("../config/config");

const formatGallery = (gallery) => {
  const galleryObj = gallery.toObject ? gallery.toObject() : gallery;
  return {
    ...galleryObj,
    images: galleryObj.images.map((img) => getImageUrl(img)),
  };
};

// @route   GET /api/gallery
// @desc    Get all gallery albums
// @access  Public
router.get("/", async (req, res) => {
  try {
    const albums = await Gallery.find().sort({ createdAt: -1 });
    const formattedAlbums = albums.map(formatGallery);
    res.json(formattedAlbums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get single album
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json(formatGallery(album));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gallery
// @desc    Create album
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const album = new Gallery({
      name: req.body.name,
      images: [],
    });

    const savedAlbum = await album.save();
    res.status(201).json(formatGallery(savedAlbum));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update album name
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const album = await Gallery.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.json(formatGallery(album));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/gallery/:id/images
// @desc    Add images to album
// @access  Private
router.post(
  "/:id/images",
  auth,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const album = await Gallery.findById(req.params.id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }

      const imagePaths = req.files.map(
        (file) => "/uploads/gallery/" + file.filename
      );
      album.images.push(...imagePaths);
      await album.save();

      res.json(formatGallery(album));
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// @route   DELETE /api/gallery/:id/images
// @desc    Delete image from album
// @access  Private
router.delete("/:id/images", auth, async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const { imagePath } = req.body;
    album.images = album.images.filter((img) => img !== imagePath);
    await album.save();

    res.json(formatGallery(album));
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete album
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const album = await Gallery.findByIdAndDelete(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
