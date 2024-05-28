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

      const { _id, email, userName, profileImage, score, position } = user;

      res.status(200).json({
        _id,
        email,
        userName,
        profileImage,
        score,
        position,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Find all users and update positions
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ score: -1 });

    // Update positions and movements
    for (let i = 0; i < users.length; i++) {
      if (users[i].position && users[i].position !== i + 1) {
        users[i].movement = users[i].position > i + 1 ? "up" : "down";
      } else {
        users[i].movement = "";
      }
      users[i].position = i + 1;
      await users[i].save();
    }

    console.log("Fetched users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
});

// Update user scores
router.put("/users/update-scores", async (req, res, next) => {
  try {
    const { users } = req.body;
    for (const userData of users) {
      await User.findByIdAndUpdate(userData._id, {
        score: userData.score,
        position: userData.position,
        movement: userData.movement,
      });
    }
    res.status(200).json({ message: "User scores updated" });
  } catch (error) {
    console.error("Error updating user scores:", error);
    next(error);
  }
});

module.exports = router;
