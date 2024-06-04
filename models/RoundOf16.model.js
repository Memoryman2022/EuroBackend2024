// models/RoundOf16Game.model.js
const mongoose = require("mongoose");

const RoundOf16Schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
});

const RoundOf16 = mongoose.model("RoundOf16", RoundOf16Schema);

module.exports = RoundOf16;
