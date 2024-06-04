const express = require("express");
const router = express.Router();
const updateQuarterFinalGames = require("../utils/updateQuarterFinalGames");
const QuarterFinalGame = require("../models/QuarterFinal.model");

// Route to get all quarter-final games
router.get("/", async (req, res, next) => {
  try {
    const quarterFinalGames = await QuarterFinalGame.find();
    res.status(200).json(quarterFinalGames);
  } catch (error) {
    next(error);
  }
});

router.post("/update", async (req, res) => {
  try {
    await updateQuarterFinalGames();
    res
      .status(200)
      .json({ message: "Quarter-final games updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quarter-final games", error });
  }
});

module.exports = router;
