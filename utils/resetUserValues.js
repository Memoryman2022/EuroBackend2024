const mongoose = require("mongoose");
const User = require("../models/User.model");
const { MONGO_URI } = require("../config/config");

// Function to reset user values
const resetUserValues = async (userName = null) => {
  try {
    const filter = userName ? { userName } : {};
    console.log(`Filter: ${JSON.stringify(filter)}`);

    const users = await User.find(filter);
    console.log(`Users found: ${users.length}`);

    for (const user of users) {
      user.score = 0;
      user.correctScores = 0;
      user.correctOutcomes = 0;
      user.position = 0;
      user.previousPosition = 0;
      await user.save();
      console.log(`Reset values for user: ${user.userName}`);
    }

    console.log(
      `User values reset successfully${userName ? ` for user ${userName}` : ""}`
    );
  } catch (error) {
    console.error("Error resetting user values:", error);
  }
};

// Connect to the database and reset the user values
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to the database");

    const userName = process.argv[2]; // Get userName from command line arguments
    console.log(`Username argument: ${userName}`);
    await resetUserValues(userName);

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Run this script using the command: node utils/resetUserValues.js [userName]
