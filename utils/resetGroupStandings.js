const mongoose = require("mongoose");
const GroupStanding = require("../models/GroupStandings.model");
const { MONGO_URI } = require("../config/config");

// Function to reset group standings
const resetGroupStandings = async () => {
  try {
    const groupStandings = await GroupStanding.find();

    for (const group of groupStandings) {
      group.teams.forEach((team) => {
        team.points = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
        team.wins = 0;
        team.draws = 0;
        team.losses = 0;
        team.goalDifference = 0;
        team.previousPosition = null;
        team.movement = null;
      });
      await group.save();
    }

    console.log("Group standings reset successfully");
  } catch (error) {
    console.error("Error resetting group standings:", error);
  }
};

// Connect to the database and reset the group standings
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to the database");
    await resetGroupStandings();
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Run this script using the command: node utils/resetGroupStandings.js
