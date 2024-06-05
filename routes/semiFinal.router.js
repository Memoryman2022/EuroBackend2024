// const express = require("express");
// const router = express.Router();
// const updateSemiFinalGames = require("../utils/updateSemiFinalGames");
// const SemiFinalGame = require("../models/SemiFinal.model");

// // Route to get all semi-final games
// router.get("/", async (req, res, next) => {
//   try {
//     const semiFinalGames = await SemiFinalGame.find();
//     res.status(200).json(semiFinalGames);
//   } catch (error) {
//     next(error);
//   }
// });

// router.post("/update", async (req, res) => {
//   try {
//     await updateSemiFinalGames();
//     res.status(200).json({ message: "Semi-final games updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating semi-final games", error });
//   }
// });

// module.exports = router;
