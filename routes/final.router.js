const express = require("express");
const router = express.Router();
const updateFinalGames = require("../utils/updateFinalGames");
const FinalGame = require("../models/Final.model");

// Route to get all final games
router.get("/", async (req, res, next) => {
  try {
    const finalGames = await FinalGame.find();
    res.status(200).json(finalGames);
  } catch (error) {
    next(error);
  }
});

// Route to update final games
router.post("/update", async (req, res) => {
  try {
    await updateFinalGames();
    res.status(200).json({ message: "Final games updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating final games", error });
  }
});

module.exports = router;
