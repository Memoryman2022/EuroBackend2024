// middleware/authenticateAdmin.js

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const authenticateAdmin = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      "tokens.token": token,
    });
    if (!user || user.role !== "admin") {
      throw new Error("Not authorized as admin");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized as admin" });
  }
};

module.exports = authenticateAdmin;
