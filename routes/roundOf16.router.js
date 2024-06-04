// routes/roundOf16.js
const express = require("express");
const RoundOf16 = require("../models/RoundOf16.model");
const router = express.Router();

// Fetch all round of 16 games
router.get("/", async (req, res) => {
  try {
    const games = await RoundOf16.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
