// seed/roundOf16GamesSeed.js
const mongoose = require("mongoose");
const RoundOf16Game = require("../models/RoundOf16.model");

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

mongoose.connect("mongodb://localhost:27017/Euro_Sweepstake");

const seedDB = async () => {
  try {
    await RoundOf16Game.deleteMany({});
    await RoundOf16Game.insertMany(roundOf16Games);
    console.log("Database seeded with round of 16 games");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

//node seed/roundOf16Seed.js
