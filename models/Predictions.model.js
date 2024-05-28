const mongoose = require("mongoose");
const { Schema } = mongoose;

const predictionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gameId: { type: String, required: true },
    date: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    team1Score: { type: Number, required: true },
    team2Score: { type: Number, required: true },
    predictedOutcome: {
      type: String,
      enum: ["team1", "draw", "team2"],
      required: true,
    },
    confirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);

module.exports = Prediction;
