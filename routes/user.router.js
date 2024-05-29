const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { authenticateToken } = require("../middleware/authenticateToken");
const { AppError } = require("../middleware/errorHandling");

// Get user details (protected)
router.get(
  "/protected/user/:userId",
  authenticateToken,
  async (req, res, next) => {
    console.log("Requested user ID:", req.params.userId);
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        throw new AppError("Invalid user ID", 400);
      }

      const user = await User.findById(req.params.userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const {
        _id,
        email,
        userName,
        profileImage,
        score,
        position,
        movement,
        previousPosition,
      } = user;

      res.status(200).json({
        _id,
        email,
        userName,
        profileImage,
        score,
        position,
        movement,
        previousPosition,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Find all users and update positions
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ score: -1 });

    console.log("Fetched users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
});

// Update user scores
router.put("/update-scores", async (req, res, next) => {
  try {
    const { users } = req.body;

    // Fetch current users from the database
    const currentUsers = await User.find({
      _id: { $in: users.map((u) => u._id) },
    });

    for (const userData of users) {
      const currentUser = currentUsers.find(
        (u) => u._id.toString() === userData._id
      );

      // Set previous position before updating
      userData.previousPosition = currentUser.position;

      await User.findByIdAndUpdate(userData._id, {
        score: userData.score,
        position: userData.position,
        movement: userData.movement,
        previousPosition: userData.previousPosition,
      });
    }

    res.status(200).json({ message: "User scores updated" });
  } catch (error) {
    console.error("Error updating user scores:", error);
    next(error);
  }
});

// Endpoint to update user movements
router.put("/update-movements", async (req, res) => {
  const { users } = req.body;

  try {
    for (let userData of users) {
      await User.findByIdAndUpdate(userData._id, {
        movement: userData.movement,
        position: userData.position,
        previousPosition: userData.previousPosition,
      });
    }
    res.status(200).send({ message: "User movements updated successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to update user movements" });
  }
});

module.exports = router;
