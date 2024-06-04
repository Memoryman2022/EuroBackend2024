const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quarterFinalGameSchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
});

const QuarterFinalGame = mongoose.model(
  "QuarterFinalGame",
  quarterFinalGameSchema
);
module.exports = QuarterFinalGame;
