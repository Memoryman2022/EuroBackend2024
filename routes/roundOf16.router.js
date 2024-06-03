const express = require("express");
const RoundOf16 = require("../models/RoundOf16.model"); // MongoDB model for storing Round of 16 fixtures
const calculateStandings = require("../utils/calculateStandings");
const populateKnockoutStages = require("../utils/populateKnockoutStages");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fixtures } = req.body;

    // Store the fixtures in the database
    let roundOf16 = new RoundOf16({ fixtures });
    await roundOf16.save();

    res.status(201).send("Round of 16 fixtures saved");
  } catch (error) {
    console.error("Error saving Round of 16 fixtures:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const roundOf16 = await RoundOf16.findOne();
    res.json(roundOf16.fixtures);
  } catch (error) {
    console.error("Error fetching Round of 16 fixtures:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/calculate", async (req, res) => {
  try {
    const { groupStageGames } = req.body;

    // Calculate the standings and knockout stages
    const standings = calculateStandings(groupStageGames);
    const knockoutStages = populateKnockoutStages(standings);

    // Store the fixtures in the database
    let roundOf16 = new RoundOf16({ fixtures: knockoutStages.roundOf16Games });
    await roundOf16.save();

    res.status(201).send("Round of 16 fixtures calculated and saved");
  } catch (error) {
    console.error("Error calculating and saving Round of 16 fixtures:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
