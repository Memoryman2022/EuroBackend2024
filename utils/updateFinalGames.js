// const RealResult = require("../models/RealResult.model");
// const FinalGame = require("../models/Final.model");
// const { finalGames } = require("../config/finalGames");

// const updateFinalGames = async () => {
//   try {
//     const realResults = await RealResult.find();
//     const semiFinalWinners = {};

//     realResults.forEach((result) => {
//       const winner =
//         result.team1Score > result.team2Score
//           ? result.team1
//           : result.team1Score < result.team2Score
//           ? result.team2
//           : null; // Handle draws if necessary

//       if (winner) {
//         semiFinalWinners[result.gameId] = winner;
//       }
//     });

//     const finalGamesData = finalGames.map((game) => {
//       const team1 = semiFinalWinners[game.team1];
//       const team2 = semiFinalWinners[game.team2];

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

//     await FinalGame.deleteMany({});
//     await FinalGame.insertMany(finalGamesData);

//     console.log("Final games updated successfully");
//   } catch (error) {
//     console.error("Error updating final games:", error);
//     throw error;
//   }
// };

// module.exports = updateFinalGames;
