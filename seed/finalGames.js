const mongoose = require("mongoose");
const FinalGame = require("../models/Final.model");
const { finalGames } = require("../config/finalGames");

// Function to seed final games
const seedFinalGames = async () => {
  try {
    await FinalGame.deleteMany({});
    await FinalGame.insertMany(finalGames);
    console.log("Final games seeded successfully");
  } catch (error) {
    console.error("Error seeding final games:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to the database and run the seed function
mongoose
  .connect("mongodb://localhost:27017/Euro_Sweepstake")
  .then(() => {
    console.log("Connected to the database");
    return seedFinalGames();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Run this script using the command: node seed/finalGames.js
