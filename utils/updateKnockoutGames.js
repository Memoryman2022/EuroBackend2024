const RealResult = require("../models/RealResult.model");
const QuarterFinalGame = require("../models/QuarterFinal.model");
const SemiFinalGame = require("../models/SemiFinal.model");
const FinalGame = require("../models/Final.model");
const { quarterFinalGames } = require("../config/quarterFinalGames");
const { semiFinalGames } = require("../config/semiFinalGames");
const { finalGames } = require("../config/finalGames");

// Function to update quarter-final games
const updateQuarterFinalGames = async () => {
  try {
    const realResults = await RealResult.find();
    const roundOf16Winners = {};

    realResults.forEach((result) => {
      const winner =
        result.team1Score > result.team2Score
          ? result.team1
          : result.team1Score < result.team2Score
          ? result.team2
          : null; // Handle draws if necessary

      if (winner) {
        roundOf16Winners[result.gameId] = winner;
      }
    });

    const quarterFinalGamesData = quarterFinalGames.map((game) => {
      const team1 = roundOf16Winners[game.team1];
      const team2 = roundOf16Winners[game.team2];

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

    await QuarterFinalGame.deleteMany({});
    await QuarterFinalGame.insertMany(quarterFinalGamesData);

    console.log("Quarter-final games updated successfully");
  } catch (error) {
    console.error("Error updating quarter-final games:", error);
    throw error;
  }
};

// Function to update semi-final games
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

// Function to update final games
const updateFinalGames = async () => {
  try {
    const realResults = await RealResult.find();
    const semiFinalWinners = {};

    realResults.forEach((result) => {
      const winner =
        result.team1Score > result.team2Score
          ? result.team1
          : result.team1Score < result.team2Score
          ? result.team2
          : null; // Handle draws if necessary

      if (winner) {
        semiFinalWinners[result.gameId] = winner;
      }
    });

    const finalGamesData = finalGames.map((game) => {
      const team1 = semiFinalWinners[game.team1];
      const team2 = semiFinalWinners[game.team2];

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

    await FinalGame.deleteMany({});
    await FinalGame.insertMany(finalGamesData);

    console.log("Final games updated successfully");
  } catch (error) {
    console.error("Error updating final games:", error);
    throw error;
  }
};

module.exports = {
  updateQuarterFinalGames,
  updateSemiFinalGames,
  updateFinalGames,
};
