const express = require("express");
const calculateStandings = require("../utils/calculateStandings");

const router = express.Router();

router.post("/calculate", async (req, res) => {
  try {
    const { groupStageGames } = req.body;
    const standings = calculateStandings(groupStageGames);
    res.json(standings);
  } catch (error) {
    console.error("Error calculating standings:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
