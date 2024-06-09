const mongoose = require("mongoose");
const RoundOf16Game = require("../models/RoundOf16.model");
const QuarterFinalGame = require("../models/QuarterFinal.model");
const SemiFinalGame = require("../models/SemiFinal.model");
const FinalGame = require("../models/Final.model");
const { MONGO_URI } = require("../config/config");
const roundOf16Games = [
  { id: "R16-1", date: "29 Jun 18:00", team1: "2A", team2: "2B" },
  { id: "R16-2", date: "29 Jun 21:00", team1: "1A", team2: "2C" },
  { id: "R16-3", date: "30 Jun 18:00", team1: "1C", team2: "3D/E/F" },
  { id: "R16-4", date: "30 Jun 21:00", team1: "1B", team2: "3A/D/E/F" },
  { id: "R16-5", date: "01 Jul 18:00", team1: "2D", team2: "2E" },
  { id: "R16-6", date: "01 Jul 21:00", team1: "1F", team2: "3A/B/C" },
  { id: "R16-7", date: "02 Jul 18:00", team1: "1E", team2: "3A/B/C/D" },
  { id: "R16-8", date: "02 Jul 21:00", team1: "1D", team2: "2F" },
];

const quarterFinalGames = [
  { id: "Q1", date: "05 Jul 18:00", team1: "R16-4", team2: "R16-2" },
  { id: "Q2", date: "05 Jul 21:00", team1: "R16-6", team2: "R16-5" },
  { id: "Q3", date: "06 Jul 18:00", team1: "R16-3", team2: "R16-1" },
  { id: "Q4", date: "06 Jul 21:00", team1: "R16-7", team2: "R16-8" },
];

const semiFinalGames = [
  { id: "S1", date: "09 Jul 21:00", team1: "Q1", team2: "Q2" },
  { id: "S2", date: "10 Jul 21:00", team1: "Q3", team2: "Q4" },
];

const finalGames = [
  { id: "F1", date: "14 Jul 21:00", team1: "S1", team2: "S2" },
];

mongoose.connect(MONGO_URI);

const seedDB = async () => {
  try {
    // Round of 16
    await RoundOf16Game.deleteMany({});
    await RoundOf16Game.insertMany(roundOf16Games);
    console.log("Database seeded with Round of 16 games");

    // Quarter-finals
    await QuarterFinalGame.deleteMany({});
    await QuarterFinalGame.insertMany(quarterFinalGames);
    console.log("Database seeded with Quarter-final games");

    // Semi-finals
    await SemiFinalGame.deleteMany({});
    await SemiFinalGame.insertMany(semiFinalGames);
    console.log("Database seeded with Semi-final games");

    // Finals
    await FinalGame.deleteMany({});
    await FinalGame.insertMany(finalGames);
    console.log("Database seeded with Final games");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

// node seed/seedAllKnockoutGames.js
