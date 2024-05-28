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

const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5005;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to the DB", err));

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_IP_URL,
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", predictionRoutes);

const io = initializeSocket(server); // Initialize WebSocket server and get io instance

app.use("/api", initializeMessageRoutes(io));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port ${PORT}`);
});
