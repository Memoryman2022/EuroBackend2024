const RoundOf16Game = require("../models/RoundOf16.model");
const QuarterFinalGame = require("../models/QuarterFinal.model");
const { quarterFinalGames } = require("../config/quarterFinalGames");

const updateQuarterFinalGames = async () => {
  try {
    const roundOf16Winners = {};

    const roundOf16Games = await RoundOf16Game.find();
    roundOf16Games.forEach((game) => {
      const winner =
        game.team1Score > game.team2Score
          ? game.team1
          : game.team1Score < game.team2Score
          ? game.team2
          : null; // Add logic for handling draws if necessary

      if (winner) {
        roundOf16Winners[game.id] = winner;
      }
    });

    const quarterFinalGamesData = quarterFinalGames.map((game) => ({
      id: game.id,
      date: game.date,
      team1: roundOf16Winners[game.team1],
      team2: roundOf16Winners[game.team2],
    }));

    await QuarterFinalGame.deleteMany({});
    await QuarterFinalGame.insertMany(quarterFinalGamesData);

    console.log("Quarter-final games updated successfully");
  } catch (error) {
    console.error("Error updating quarter-final games:", error);
  }
};

module.exports = updateQuarterFinalGames;
