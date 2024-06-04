// seed/quarterFinalGamesSeed.js
const mongoose = require("mongoose");
const QuarterFinalGame = require("../models/QuarterFinal.model");

const quarterFinalGames = [
  { id: "Q1", date: "05 Jul 18:00", team1: "R16-4", team2: "R16-2" },
  { id: "Q2", date: "05 Jul 21:00", team1: "R16-6", team2: "R16-5" },
  { id: "Q3", date: "06 Jul 18:00", team1: "R16-3", team2: "R16-1" },
  { id: "Q4", date: "06 Jul 21:00", team1: "R16-7", team2: "R16-8" },
];

mongoose.connect("mongodb://localhost:27017/Euro_Sweepstake");

const seedDB = async () => {
  try {
    await QuarterFinalGame.deleteMany({});
    await QuarterFinalGame.insertMany(quarterFinalGames);
    console.log("Database seeded with quarter-final games");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

//node seed/quarterFinalsSeed.js
