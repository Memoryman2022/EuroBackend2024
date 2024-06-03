const mongoose = require("mongoose");

const RoundOf16Schema = new mongoose.Schema({
  fixtures: [
    {
      id: String,
      date: String,
      team1: String,
      team2: String,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RoundOf16", RoundOf16Schema);
