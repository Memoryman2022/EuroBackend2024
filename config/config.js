// config.js/
require("dotenv").config();

// const isDevelopment = process.env.NODE_ENV === "development"
const MONGO_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_LOCAL
    : process.env.MONGODB_URI_REMOTE;

const allowedOrigins = [
  "http://localhost:5173", // Frontend server
  process.env.ORIGIN, // Production frontend URL from environment variables
  // "https://eurosweepstake2024.netlify.app",
];

module.exports = {
  MONGO_URI,
  allowedOrigins,
};
