const mongoose = require("mongoose");
const GroupStanding = require("../models/GroupStandings.model");
const RealResult = require("../models/RealResult.model");
const { MONGO_URI } = require("./config");
// Function to clean up group standings based on group name pattern
const cleanupGroupStandings = async () => {
  try {
    const result = await GroupStanding.deleteMany({
      groupName: { $regex: /^(R16|Q|S|F1)/ }, // Adjust the regex as needed to match group names to delete
    });
    console.log(
      `Removed ${result.deletedCount} groups from GroupStanding collection`
    );
  } catch (error) {
    console.error("Error removing group standings:", error);
  }
};

// Function to clean up real results based on game ID pattern
const cleanupRealResults = async () => {
  try {
    const result = await RealResult.deleteMany({
      gameId: { $regex: /^(R16|Q|S|F1)/ },
    });
    console.log(
      `Removed ${result.deletedCount} fixtures from RealResult collection`
    );
  } catch (error) {
    console.error("Error removing fixtures:", error);
  }
};

// Connect to the database and run the cleanup
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to the database");
    await cleanupGroupStandings();
    await cleanupRealResults();
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Run this script using the command: node utils/cleanupRealResults.js
