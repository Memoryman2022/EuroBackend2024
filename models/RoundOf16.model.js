const mongoose = require("mongoose");

const RoundOf16Schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: String,
  team1: String,
  team2: String,
});

const RoundOf16 = mongoose.model("RoundOf16", RoundOf16Schema);

module.exports = RoundOf16;
