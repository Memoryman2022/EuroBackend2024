const express = require("express");
const router = express.Router();
const RealResult = require("../models/RealResult.model");
const { authenticateToken } = require("../middleware/authenticateToken");

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
router.post("/:gameId/result", authenticateToken, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { team1Score, team2Score, outcome } = req.body;

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const realResult = await RealResult.findOneAndUpdate(
      { gameId },
      { team1Score, team2Score, outcome },
      { new: true, upsert: true }
    );

    res.status(200).json(realResult);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
