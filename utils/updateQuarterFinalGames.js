// const RealResult = require("../models/RealResult.model");
// const QuarterFinalGame = require("../models/QuarterFinal.model");
// const { quarterFinalGames } = require("../config/quarterFinalGames");

// const updateQuarterFinalGames = async () => {
//   try {
//     const realResults = await RealResult.find();
//     const roundOf16Winners = {};

//     realResults.forEach((result) => {
//       const winner =
//         result.team1Score > result.team2Score
//           ? result.team1
//           : result.team1Score < result.team2Score
//           ? result.team2
//           : null; // Handle draws if necessary

//       if (winner) {
//         roundOf16Winners[result.gameId] = winner;
//       }
//     });

//     const quarterFinalGamesData = quarterFinalGames.map((game) => {
//       const team1 = roundOf16Winners[game.team1];
//       const team2 = roundOf16Winners[game.team2];

//       if (!team1 || !team2) {
//         throw new Error(
//           `Missing team assignment for game ${game.id}: ${team1} vs ${team2}`
//         );
//       }

//       return {
//         id: game.id,
//         date: game.date,
//         team1,
//         team2,
//       };
//     });

//     await QuarterFinalGame.deleteMany({});
//     await QuarterFinalGame.insertMany(quarterFinalGamesData);

//     console.log("Quarter-final games updated successfully");
//   } catch (error) {
//     console.error("Error updating quarter-final games:", error);
//     throw error;
//   }
// };

// module.exports = updateQuarterFinalGames;
