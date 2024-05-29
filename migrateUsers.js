const mongoose = require("mongoose");
const User = require("./models/User.model"); // Adjust the path to your User model
require("dotenv").config(); // Load environment variables from .env file

const isDevelopment = process.env.NODE_ENV === "development";

const MONGO_URI = isDevelopment
  ? process.env.MONGODB_URI_LOCAL
  : process.env.MONGODB_URI_REMOTE;

const migrateUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const users = await User.find({});

    for (const user of users) {
      if (user.previousPosition === undefined) {
        user.previousPosition = 0;
        await user.save();
      }
    }

    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateUsers();
