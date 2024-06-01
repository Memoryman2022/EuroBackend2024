const express = require("express");
const router = express.Router();
const RealResult = require("../models/RealResult.model");
const Prediction = require("../models/Predictions.model");
const User = require("../models/User.model");

// Route to fetch the real result of a specific game
router.get("/:gameId/result", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const realResult = await RealResult.findOne({ gameId });

    if (!realResult) {
      return res.status(404).json({ message: "Real result not found" });
    }

    res.status(200).json(realResult);
  } catch (error) {
    next(error);
  }
});

// Route to save the real result for a specific game
router.post("/:gameId/result", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { team1Score, team2Score, outcome } = req.body;

    const realResult = await RealResult.findOneAndUpdate(
      { gameId },
      { team1Score, team2Score, outcome },
      { new: true, upsert: true }
    );

    // Fetch all predictions for this game
    const predictions = await Prediction.find({ gameId });

    // Update user scores based on predictions
    for (const prediction of predictions) {
      let points = 0;

      // Correct score prediction
      if (
        prediction.team1Score === team1Score &&
        prediction.team2Score === team2Score
      ) {
        points += 5;
      }

      // Correct outcome prediction
      const predictedOutcome =
        prediction.team1Score > prediction.team2Score
          ? "team1 win"
          : prediction.team1Score < prediction.team2Score
          ? "team2 win"
          : "draw";

      if (predictedOutcome === outcome) {
        points += 2;
      }

      // Update the user's score
      const user = await User.findById(prediction.userId);
      if (user) {
        user.score += points;
        await user.save();
      }
    }

    res
      .status(200)
      .json({ message: "Real result and user scores updated successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
