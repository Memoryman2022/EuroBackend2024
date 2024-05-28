const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  score: { type: Number, default: 0 },
  movement: { type: String, default: "" },
  position: { type: Number, default: 0 },
});

module.exports = model("User", userSchema);
