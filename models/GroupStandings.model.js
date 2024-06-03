// models/GroupStandings.model.js

const mongoose = require("mongoose");

const TeamStatsSchema = new mongoose.Schema({
  team: String,
  points: Number,
  goalsFor: Number,
  goalsAgainst: Number,
  goalDifference: Number,
  wins: Number,
  draws: Number,
  losses: Number,
});

const GroupStandingsSchema = new mongoose.Schema({
  group: String,
  standings: [TeamStatsSchema],
});

module.exports = mongoose.model("GroupStandings", GroupStandingsSchema);
