const mongoose = require("mongoose");
const GroupStandings = require("../models/GroupStandings.model");
const { MONGO_URI } = require("../config/config");

// Initial groups data
const initialGroups = {
  GA: ["Germany", "Scotland", "Hungary", "Switzerland"],
  GB: ["Spain", "Croatia", "Italy", "Albania"],
  GC: ["Slovenia", "Denmark", "Serbia", "England"],
  GD: ["Poland", "Netherlands", "Austria", "France"],
  GE: ["Belgium", "Slovakia", "Romania", "Ukraine"],
  GF: ["Turkey", "Georgia", "Portugal", "Czechia"],
};

// Function to seed initial group standings
const seedGroupStandings = async (groupToReset) => {
  try {
    const groups = groupToReset ? [groupToReset] : Object.keys(initialGroups);

    for (const group of groups) {
      const teams = initialGroups[group].map((team) => ({
        name: team,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalDifference: 0,
        previousPosition: null,
        movement: null,
      }));

      // Check if the group already exists in the database
      const existingGroup = await GroupStandings.findOne({ groupName: group });

      if (existingGroup) {
        // Update existing teams or add new teams to the group
        teams.forEach((team) => {
          const existingTeam = existingGroup.teams.find(
            (t) => t.name === team.name
          );
          if (existingTeam) {
            existingTeam.points = team.points;
            existingTeam.goalsFor = team.goalsFor;
            existingTeam.goalsAgainst = team.goalsAgainst;
            existingTeam.wins = team.wins;
            existingTeam.draws = team.draws;
            existingTeam.losses = team.losses;
            existingTeam.goalDifference = team.goalDifference;
            existingTeam.previousPosition = team.previousPosition;
            existingTeam.movement = team.movement;
          } else {
            existingGroup.teams.push(team);
          }
        });

        // Save the updated group
        await existingGroup.save();
      } else {
        // Create a new group if it does not exist
        await GroupStandings.create({
          groupName: group,
          teams,
        });
      }
    }

    console.log(
      `Group standings reseeded successfully for group${
        groupToReset ? " " + groupToReset : "s"
      }`
    );
  } catch (error) {
    console.error("Error reseeding group standings:", error);
  }
};

// Connect to the database and run the reseed function
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to the database");

    // Check for command line arguments
    const args = process.argv.slice(2);
    const groupToReset = args.length > 0 ? args[0] : null;

    await seedGroupStandings(groupToReset);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Run this script using the command: node seed/reseedGroupStandings.js [GroupID]
