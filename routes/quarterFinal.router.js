const express = require("express");
const router = express.Router();
const updateQuarterFinalGames = require("../utils/updateQuarterFinalGames");

router.post("/update", async (req, res) => {
  try {
    await updateQuarterFinalGames();
    res
      .status(200)
      .json({ message: "Quarter-final games updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quarter-final games", error });
  }
});

module.exports = router;
