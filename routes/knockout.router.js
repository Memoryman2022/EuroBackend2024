const express = require("express");
const router = express.Router();

const {
  updateRoundOf16Games,
  updateQuarterFinalGames,
  updateSemiFinalGames,
  updateFinalGames,
} = require("../utils/updateKnockoutGames");

const RoundOf16 = require("../models/RoundOf16.model");
const QuarterFinalGame = require("../models/QuarterFinal.model");
const SemiFinalGame = require("../models/SemiFinal.model");
const FinalGame = require("../models/Final.model");

// Round of 16 routes
router.get("/roundof16", async (req, res) => {
  try {
    const games = await RoundOf16.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/roundof16/update", async (req, res) => {
  try {
    await updateRoundOf16Games();
    res.status(200).send("Round of 16 games updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quarter-final routes
router.get("/quarterfinalgames", async (req, res) => {
  try {
    const quarterFinalGames = await QuarterFinalGame.find();
    res.status(200).json(quarterFinalGames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/quarterfinalgames/update", async (req, res) => {
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

// Semi-final routes
router.get("/semifinalgames", async (req, res) => {
  try {
    const semiFinalGames = await SemiFinalGame.find();
    res.status(200).json(semiFinalGames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/semifinalgames/update", async (req, res) => {
  try {
    await updateSemiFinalGames();
    res.status(200).json({ message: "Semi-final games updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating semi-final games", error });
  }
});

// Final routes
router.get("/finalgames", async (req, res) => {
  try {
    const finalGames = await FinalGame.find();
    res.status(200).json(finalGames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/finalgames/update", async (req, res) => {
  try {
    await updateFinalGames();
    res.status(200).json({ message: "Final games updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating final games", error });
  }
});

module.exports = router;
