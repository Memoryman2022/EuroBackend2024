require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { createServer } = require("http");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
const server = createServer(app);
const initializeSocket = require("./utils/socket");

const authRoutes = require("./routes/auth.router");
const userRoutes = require("./routes/user.router");
const predictionRoutes = require("./routes/prediction.router");
const initializeMessageRoutes = require("./routes/messages.router");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandling");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Determine the environment and set the MongoDB URI accordingly
const isDevelopment = process.env.NODE_ENV === "development";
const MONGO_URI = isDevelopment
  ? process.env.MONGODB_URI_LOCAL
  : process.env.MONGODB_URI_REMOTE;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then((connection) =>
    console.log(`Connected to Database: "${connection.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to the DB", err));

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.ORIGIN,
      "https://eurosweepstake2024.netlify.app",
      "http://192.168.0.113:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/predictions", predictionRoutes);

// Initialize WebSocket server
const io = initializeSocket(server);
app.use("/api", initializeMessageRoutes(io));

// Error handling middleware
app.use(errorHandler);
app.use(notFoundHandler);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
