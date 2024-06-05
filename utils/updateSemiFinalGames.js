const RealResult = require("../models/RealResult.model");
const SemiFinalGame = require("../models/SemiFinal.model");
const { semiFinalGames } = require("../config/semiFinalGames");

const updateSemiFinalGames = async () => {
  try {
    const realResults = await RealResult.find();
    const quarterFinalWinners = {};

    realResults.forEach((result) => {
      const winner =
        result.team1Score > result.team2Score
          ? result.team1
          : result.team1Score < result.team2Score
          ? result.team2
          : null; // Handle draws if necessary

      if (winner) {
        quarterFinalWinners[result.gameId] = winner;
      }
    });

    const semiFinalGamesData = semiFinalGames.map((game) => {
      const team1 = quarterFinalWinners[game.team1];
      const team2 = quarterFinalWinners[game.team2];

      if (!team1 || !team2) {
        throw new Error(
          `Missing team assignment for game ${game.id}: ${team1} vs ${team2}`
        );
      }

      return {
        id: game.id,
        date: game.date,
        team1,
        team2,
      };
    });

    await SemiFinalGame.deleteMany({});
    await SemiFinalGame.insertMany(semiFinalGamesData);

    console.log("Semi-final games updated successfully");
  } catch (error) {
    console.error("Error updating semi-final games:", error);
    throw error;
  }
};

module.exports = updateSemiFinalGames;
