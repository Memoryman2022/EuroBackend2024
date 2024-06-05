const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: { type: String },
  points: { type: Number },
  goalsFor: { type: Number },
  goalsAgainst: { type: Number },
  wins: { type: Number },
  draws: { type: Number },
  losses: { type: Number },
  goalDifference: { type: Number },
  previousPosition: { type: Number, default: null },
  movement: { type: String, defualt: null },
});

const GroupStandingsSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  teams: [TeamSchema],
});

const GroupStandings = mongoose.model("GroupStandings", GroupStandingsSchema);

module.exports = GroupStandings;
