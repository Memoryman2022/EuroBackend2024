require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { createServer } = require("http");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const server = createServer(app);
const initializeSocket = require("./utils/socket");

const authRoutes = require("./routes/auth.router");
const userRoutes = require("./routes/user.router");
const predictionRoutes = require("./routes/prediction.router");
const realResultRoutes = require("./routes/realResult.router");
const standingsRoutes = require("./routes/standings.router");
const roundOf16Routes = require("./routes/roundOf16.router");
const knockoutRoutes = require("./routes/knockout.router");

const initializeMessageRoutes = require("./routes/messages.router");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandling");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB
const connectionString = process.env.DATABASE_URL;
/// const connectionString = process.env.MONGODB_URI_LOCAL;
const { allowedOrigins } = require("./config/config");
mongoose
  .connect(connectionString)
  .then((connection) =>
    console.log(`Connected to Database: "${connection.connections[0].name}"`)
  )
  .catch((err) => {
    console.error("Error connecting to the DB", err);
    process.exit(1); // Exit the process if the database connection fails
  });
/// Middleware
app.use(
  cors({
    origin: [
      allowedOrigins,
      process.env.ORIGIN,
      "https://eurosweepstake2024.netlify.app",
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
app.use("/api/realresults", realResultRoutes);
app.use("/api/groupStandings", standingsRoutes);
app.use("/api/roundof16", roundOf16Routes);

app.use("/api/knockout", knockoutRoutes);

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
