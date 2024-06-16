const mongoose = require("mongoose");
const { Schema } = mongoose;

const predictionSchema = new Schema({
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

mongoose.connect("mongodb://localhost:27017/Euro_Sweepstake");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to the database");

  const newPrediction = new Prediction({
    userId: new mongoose.Types.ObjectId("66662f540071e3030ba4c292"),
    gameId: "GD-1",
    date: "16 Jun 15:00",
    team1: "Poland",
    team2: "Nethrlands",
    team1Score: 0,
    team2Score: 0,
    predictedOutcome: "draw",
    confirmed: false,
    createdAt: new Date("2024-06-09T17:57:48.969Z"),
    updatedAt: new Date("2024-06-09T17:57:48.969Z"),
    __v: 0,
  });

  try {
    await newPrediction.save();
    console.log("Prediction added successfully");
  } catch (error) {
    console.error("Error adding prediction:", error);
  } finally {
    mongoose.connection.close();
  }
});
