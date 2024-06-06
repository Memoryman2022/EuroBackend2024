// config.js
require("dotenv").config();

// const isDevelopment = process.env.NODE_ENV === "development"
const MONGO_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_LOCAL
    : process.env.MONGODB_URI_REMOTE;

module.exports = {
  MONGO_URI,
};

//production
