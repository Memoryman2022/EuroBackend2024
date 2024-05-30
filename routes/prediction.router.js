const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
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

const ONE_HOUR = 60 * 60 * 1000;

// Route to fetch all predictions for all users grouped by game with conditions
router.get("/all", authenticateToken, async (req, res, next) => {
  try {
    const allPredictions = await Prediction.find().populate(
      "userId",
      "userName"
    );
    const allUsers = await User.find().select("_id");
    const predictionsByGame = {};

    // Group predictions by gameId
    allPredictions.forEach((prediction) => {
      if (!predictionsByGame[prediction.gameId]) {
        predictionsByGame[prediction.gameId] = [];
      }
      predictionsByGame[prediction.gameId].push(prediction);
    });

    const results = Object.keys(predictionsByGame)
      .map((gameId) => {
        const predictions = predictionsByGame[gameId];
        const match = predictions[0]; // All predictions have the same match details

        const allUsersPredicted = allUsers.every((user) =>
          predictions.some((prediction) =>
            prediction.userId._id.equals(user._id)
          )
        );

        const matchStartTime = new Date(match.date); // Assuming match start time is stored in `date` field
        const currentTime = new Date();
        const timeDifference = matchStartTime - currentTime;
        const isOneHourBeforeMatch =
          timeDifference <= ONE_HOUR && timeDifference >= 0;

        console.log(`Game ${gameId} - Match Start Time: ${matchStartTime}`);
        console.log(`Game ${gameId} - Current Time: ${currentTime}`);
        console.log(`Game ${gameId} - Time Difference: ${timeDifference}`);
        console.log(
          `Game ${gameId} - Is One Hour Before Match: ${isOneHourBeforeMatch}`
        );

        return {
          gameId: gameId,
          team1: match.team1,
          team2: match.team2,
          startTime: match.date,
          revealPredictions: allUsersPredicted || isOneHourBeforeMatch,
          predictions: predictions,
        };
      })
      .filter((game) => game.revealPredictions);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching final predictions:", error);
    next(error);
  }
});

module.exports = router;
