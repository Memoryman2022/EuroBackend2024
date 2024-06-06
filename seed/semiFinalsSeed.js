const mongoose = require("mongoose");
const SemiFinalGame = require("../models/SemiFinal.model");
const { semiFinalGames } = require("../config/semiFinalGames");
const { MONGO_URI } = require("./config");
// Function to seed semi-final games
const seedSemiFinalGames = async () => {
  try {
    await SemiFinalGame.deleteMany({});
    await SemiFinalGame.insertMany(semiFinalGames);
    console.log("Semi-final games seeded successfully");
  } catch (error) {
    console.error("Error seeding semi-final games:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to the database and run the seed function
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    return seedSemiFinalGames();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Run this script using the command: node seed/semiFinalsSeed.js
