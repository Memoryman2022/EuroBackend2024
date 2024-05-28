const express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const Message = require("../models/Message.model");
const User = require("../models/User.model");

const initializeMessageRoutes = (io) => {
  const router = express.Router();

  // Create a new message
  router.post("/messages", authenticateToken, async (req, res, next) => {
    console.log("POST /messages - Request received");
    try {
      const { content } = req.body;
      const userId = req.payload.userId;

      console.log("POST /messages - Fetching user with ID:", userId);
      const user = await User.findById(userId);

      if (!user) {
        console.log("POST /messages - User not found:", userId);
        return res.status(404).json({ message: "User not found" });
      }

      console.log("POST /messages - Creating new message");
      let newMessage = await Message.create({
        content,
        user: userId,
        profileImage: user.profileImage,
      });

      console.log("POST /messages - Populating new message");
      newMessage = await Message.findById(newMessage._id).populate("user");

      console.log("POST /messages - Emitting newMessage event:", newMessage);
      io.emit("newMessage", newMessage);

      console.log("POST /messages - Message created successfully:", newMessage);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("POST /messages - Error:", error);
      next(error);
    }
  });

  // Fetch all messages
  router.get("/messages", authenticateToken, async (req, res, next) => {
    console.log("GET /messages - Request received");
    try {
      const messages = await Message.find()
        .populate("user")
        .sort({ createdAt: 1 });
      console.log("GET /messages - Messages fetched successfully");
      res.status(200).json(messages);
    } catch (error) {
      console.error("GET /messages - Error:", error);
      next(error);
    }
  });

  return router;
};

module.exports = initializeMessageRoutes;
