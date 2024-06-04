const RealResult = require("../models/RealResult.model");
const GroupStandings = require("../models/GroupStandings.model");

const updateGroupStandings = async () => {
  try {
    // Fetch all real results
    const realResults = await RealResult.find();

    // Group the results by group name
    const groupGamesByGroup = realResults.reduce((acc, result) => {
      const group = result.gameId.split("-")[0]; // Assuming gameId format is like "GA-1"
      if (!acc[group]) acc[group] = [];
      acc[group].push({
        team1: result.team1,
        team2: result.team2,
        team1Score: result.team1Score,
        team2Score: result.team2Score,
      });
      return acc;
    }, {});

    const standings = {};

    // Initialize standings object
    Object.keys(groupGamesByGroup).forEach((group) => {
      standings[group] = [];
      groupGamesByGroup[group].forEach((game) => {
        if (!standings[group].find((team) => team.name === game.team1)) {
          standings[group].push({
            name: game.team1,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalDifference: 0,
          });
        }
        if (!standings[group].find((team) => team.name === game.team2)) {
          standings[group].push({
            name: game.team2,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalDifference: 0,
          });
        }
      });
    });

    // Update standings with game results
    Object.keys(groupGamesByGroup).forEach((group) => {
      groupGamesByGroup[group].forEach((game) => {
        const team1 = standings[group].find((team) => team.name === game.team1);
        const team2 = standings[group].find((team) => team.name === game.team2);
        if (game.team1Score !== undefined && game.team2Score !== undefined) {
          team1.goalsFor += game.team1Score;
          team1.goalsAgainst += game.team2Score;
          team2.goalsFor += game.team2Score;
          team2.goalsAgainst += game.team1Score;

          if (game.team1Score > game.team2Score) {
            team1.points += 3;
            team1.wins += 1;
            team2.losses += 1;
          } else if (game.team1Score < game.team2Score) {
            team2.points += 3;
            team2.wins += 1;
            team1.losses += 1;
          } else {
            team1.points += 1;
            team2.points += 1;
            team1.draws += 1;
            team2.draws += 1;
          }
          team1.goalDifference = team1.goalsFor - team1.goalsAgainst;
          team2.goalDifference = team2.goalsFor - team2.goalsAgainst;
        }
      });
    });

    // Sort teams in each group
    Object.keys(standings).forEach((group) => {
      standings[group].sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        } else if (b.goalDifference !== a.goalDifference) {
          return b.goalDifference - a.goalDifference;
        } else {
          return b.goalsFor - a.goalsFor;
        }
      });
    });

    // Update standings in the database
    for (const group of Object.keys(standings)) {
      const result = await GroupStandings.findOneAndUpdate(
        { groupName: group },
        { teams: standings[group] },
        { upsert: true, new: true }
      );
      console.log(`Updated standings for ${group}:`, result);
    }

    console.log("Group standings updated successfully");
  } catch (error) {
    console.error("Error updating group standings:", error);
  }
};

module.exports = updateGroupStandings;
