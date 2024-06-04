const express = require("express");
const {
  calculateStandings,
  updateGroupStandings,
} = require("../utils/updateGroupStandings");
const GroupStandings = require("../models/GroupStandings.model");

const router = express.Router();

// Route to calculate standings
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

// Route to save standings
router.post("/save", async (req, res) => {
  try {
    const { standings } = req.body;

    // Save each group's standings
    await updateStandingsInDatabase(standings);
    res.status(201).send("Group standings saved");
  } catch (error) {
    console.error("Error saving group standings:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to calculate standings and update Round of 16
router.post("/calculate-and-update", async (req, res) => {
  try {
    const { groupStageGames } = req.body;
    const standings = calculateStandings(groupStageGames);
    await updateStandingsInDatabase(standings);
    res
      .status(200)
      .send("Standings calculated and Round of 16 fixtures updated");
  } catch (error) {
    console.error("Error calculating and updating standings:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update standings from real results
router.post("/update-from-real-results", async (req, res) => {
  try {
    await updateGroupStandings();
    res.status(200).send("Group standings updated from real results");
  } catch (error) {
    console.error("Error updating group standings from real results:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get latest standings for all groups
router.get("/latest", async (req, res) => {
  try {
    const standings = await GroupStandings.find().sort({ timestamp: -1 });

    if (standings.length > 0) {
      const response = standings.reduce((acc, groupStanding) => {
        acc[groupStanding.groupName] = groupStanding.teams;
        return acc;
      }, {});

      console.log("Grouped standings data:", response); // Log the response to debug
      res.json(response);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error("Error fetching latest standings:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
