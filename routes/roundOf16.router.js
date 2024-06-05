// routes/roundOf16.js
const express = require("express");
const updateRoundOf16Games = require("../utils/updateRoundOf16Games");
const RoundOf16 = require("../models/RoundOf16.model");
const router = express.Router();

//fetch all round of 16 games
router.get("/", async (req, res) => {
  try {
    const games = await RoundOf16.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update round of 16 games based on group standings
router.post("/update", async (req, res) => {
  try {
    await updateRoundOf16Games();
    res.status(200).send("Round of 16 games updated sucsessfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
