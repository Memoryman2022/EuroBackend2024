const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Prediction = require("../models/Predictions.model");
const { authenticateToken } = require("../middleware/authenticateToken");
const {
  parse,
  differenceInMilliseconds,
  isWithinInterval,
  addHours,
  isAfter,
} = require("date-fns");

const ONE_HOUR = 60 * 60 * 1000; // One hour in milliseconds

// Function to check if the prediction window is expired or it's one hour before the match
const isPredictionWindowExpired = (gameDate) => {
  const matchStartTime = parse(
    `${gameDate} ${new Date().getFullYear()}`,
    "dd MMM HH:mm yyyy",
    new Date()
  );
  const currentTime = new Date();
  const oneHourBeforeMatch = addHours(matchStartTime, -1);

  // Check if current time is within the one-hour window before the match start time
  return (
    isWithinInterval(currentTime, {
      start: oneHourBeforeMatch,
      end: matchStartTime,
    }) && isAfter(matchStartTime, currentTime)
  );
};

// Route to add default predictions
router.post("/addDefaultPredictions", async (req, res, next) => {
  try {
    const allGames = await Prediction.distinct("gameId");
    const allUsers = await User.find().select("_id");
    const allPredictions = await Prediction.find();

    for (const gameId of allGames) {
      const predictionsForGame = allPredictions.filter(
        (p) => p.gameId === gameId
      );
      const match = predictionsForGame[0]; // All predictions have the same match details

      if (isPredictionWindowExpired(match.date)) {
        const missingUsers = allUsers.filter(
          (user) => !predictionsForGame.some((p) => p.userId.equals(user._id))
        );

        for (const user of missingUsers) {
          console.log(
            `Adding default prediction for user: ${user._id}, game: ${gameId}`
          );
          const defaultPrediction = new Prediction({
            userId: user._id,
            gameId: match.gameId,
            date: match.date,
            team1: match.team1,
            team2: match.team2,
            team1Score: 0,
            team2Score: 0,
            predictedOutcome: "draw",
            confirmed: false,
          });
          await defaultPrediction.save();
        }
      }
    }

    res
      .status(200)
      .json({ message: "Default predictions added where necessary." });
  } catch (error) {
    next(error);
  }
});

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

// Route to fetch all predictions for all users grouped by game with conditions
router.get("/all", authenticateToken, async (req, res, next) => {
  try {
    const allPredictions = await Prediction.find().populate(
      "userId",
      "userName"
    );
    const allUsers = await User.find().select("_id");

    if (!allPredictions || !allUsers) {
      throw new Error("Error fetching predictions or users.");
    }

    const predictionsByGame = {};

    // Group predictions by gameId
    allPredictions.forEach((prediction) => {
      if (prediction.userId) {
        // Ensure userId is not null
        if (!predictionsByGame[prediction.gameId]) {
          predictionsByGame[prediction.gameId] = [];
        }
        predictionsByGame[prediction.gameId].push(prediction);
      } else {
        console.error(`Prediction without userId found: ${prediction}`);
      }
    });

    const results = Object.keys(predictionsByGame)
      .map((gameId) => {
        const predictions = predictionsByGame[gameId];
        const match = predictions[0]; // All predictions have the same match details

        // Ensure match is not null
        if (!match) {
          console.error(`No match found for gameId: ${gameId}`);
          return null; // Skip this gameId
        }

        const allUsersPredicted = allUsers.every((user) =>
          predictions.some(
            (prediction) =>
              prediction.userId && prediction.userId._id.equals(user._id)
          )
        );

        const isOneHourBeforeMatch = isPredictionWindowExpired(match.date);

        console.log(
          `Game ${gameId} - Is One Hour Before Match: ${isOneHourBeforeMatch}`
        );
        console.log(
          `Game ${gameId} - All Users Predicted: ${allUsersPredicted}`
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
