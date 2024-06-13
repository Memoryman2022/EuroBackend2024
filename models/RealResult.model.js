const mongoose = require("mongoose");
const { Schema } = mongoose;

const realResultSchema = new Schema(
  {
    gameId: { type: String, required: true, unique: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    team1Score: { type: Number, required: true },
    team2Score: { type: Number, required: true },
    outcome: {
      type: String,
      enum: ["team1", "draw", "team2"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RealResult = mongoose.model("RealResult", realResultSchema);

module.exports = RealResult;
