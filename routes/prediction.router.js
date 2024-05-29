const express = require("express");
const router = express.Router();
const Prediction = require("../models/Predictions.model");
const { authenticateToken } = require("../middleware/authenticateToken");

// Route to create a new prediction
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const {
      gameId,
      date,
      team1,
      team2,
      team1Score,
      team2Score,
      predictedOutcome,
    } = req.body;

    // Check if a prediction already exists for this user and game
    const existingPrediction = await Prediction.findOne({
      userId: req.payload.userId,
      gameId,
    });

    if (existingPrediction) {
      return res
        .status(400)
        .json({ message: "Prediction already exists for this game." });
    }

    const prediction = new Prediction({
      userId: req.payload.userId,
      gameId,
      date,
      team1,
      team2,
      team1Score,
      team2Score,
      predictedOutcome,
    });

    const savedPrediction = await prediction.save();
    res.status(201).json(savedPrediction);
  } catch (error) {
    next(error);
  }
});

// Route to fetch all predictions for the authenticated user
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ userId: req.payload.userId });
    res.status(200).json(predictions);
  } catch (error) {
    next(error);
  }
});

// Route to fetch all predictions for all users grouped by game
router.get("/all", authenticateToken, async (req, res, next) => {
  try {
    const predictions = await Prediction.find().populate("userId", "userName");

    // Group predictions by gameId
    const groupedPredictions = predictions.reduce((acc, prediction) => {
      if (!acc[prediction.gameId]) {
        acc[prediction.gameId] = [];
      }
      acc[prediction.gameId].push(prediction);
      return acc;
    }, {});

    res.status(200).json(groupedPredictions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
