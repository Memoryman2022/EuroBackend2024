const mongoose = require("mongoose");
const GroupStandings = require("../models/GroupStandings.model");
const RoundOf16Game = require("../models/RoundOf16.model");

const updateRoundOf16Games = async () => {
  try {
    const standings = await GroupStandings.find();

    // Create a dictionary to store team positions within their groups
    const groupPositions = {};
    standings.forEach((group) => {
      group.teams.forEach((team, index) => {
        groupPositions[`${index + 1}${group.groupName}`] = team.name;
      });
    });

    // Extract third-place teams with their group identifiers
    const thirdPlaceTeams = [];
    standings.forEach((group) => {
      const thirdPlaceTeam = group.teams[2]; // Third-place team
      thirdPlaceTeams.push({
        group: group.groupName, // Group identifier
        name: thirdPlaceTeam.name,
        points: thirdPlaceTeam.points,
        goalDifference: thirdPlaceTeam.goalDifference,
        goalsFor: thirdPlaceTeam.goalsFor,
      });
    });

    // Sort third-place teams
    thirdPlaceTeams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      } else if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      } else {
        return b.goalsFor - a.goalsFor;
      }
    });

    const bestThirdPlaceTeams = thirdPlaceTeams.slice(0, 4);

    // Define the initial round of 16 games structure
    const roundOf16Games = [
      { id: "R16-1", date: "29 Jun 18:00", team1: "2GA", team2: "2GB" },
      { id: "R16-2", date: "29 Jun 21:00", team1: "1GA", team2: "2GC" },
      { id: "R16-3", date: "30 Jun 18:00", team1: "1GC", team2: "3DEF" },
      { id: "R16-4", date: "30 Jun 21:00", team1: "1GB", team2: "3ADEF" },
      { id: "R16-5", date: "01 Jul 18:00", team1: "2GD", team2: "2GE" },
      { id: "R16-6", date: "01 Jul 21:00", team1: "1GF", team2: "3ABC" },
      { id: "R16-7", date: "02 Jul 18:00", team1: "1GE", team2: "3ABCD" },
      { id: "R16-8", date: "02 Jul 21:00", team1: "1GD", team2: "2GF" },
    ];

    // Function to assign third-place teams to the correct fixture
    const assignThirdPlaceTeams = (fixtures, thirdPlaceTeams) => {
      const specificFixtures = ["R16-3", "R16-4", "R16-6", "R16-7"];
      thirdPlaceTeams.forEach((team) => {
        for (let fixture of fixtures) {
          // Check if fixture's id is one of the specific fixtures
          if (specificFixtures.includes(fixture.id)) {
            // Check if fixture's team2 includes the team's group identifier
            if (fixture.team2.includes(team.group.charAt(1))) {
              fixture.team2 = team.name;
              break;
            }
          }
        }
      });
    };

    // Assign the best third-place teams to the fixtures
    assignThirdPlaceTeams(roundOf16Games, bestThirdPlaceTeams);

    // Prepare the final round of 16 games with assigned teams
    const finalRoundOf16Games = roundOf16Games.map((game) => ({
      id: game.id,
      date: game.date,
      team1: groupPositions[game.team1] || game.team1,
      team2: groupPositions[game.team2] || game.team2,
    }));

    await RoundOf16Game.deleteMany({});
    await RoundOf16Game.insertMany(finalRoundOf16Games);

    console.log("Round of 16 games updated successfully");
  } catch (error) {
    console.error("Error updating round of 16 games:", error);
  }
};

module.exports = updateRoundOf16Games;
