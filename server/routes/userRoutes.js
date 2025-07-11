const express = require("express");
const {
  registerUser,
  loginUser,
  getUserData,
  getCars,
} = require("../controller/userController");
const { protectAuthorize } = require("../middleware/userMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/me", protectAuthorize, getUserData);
userRoutes.get("/cars", getCars);

module.exports = userRoutes;
