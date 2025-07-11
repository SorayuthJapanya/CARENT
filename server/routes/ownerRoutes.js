const express = require("express");
const {
  changeRoleToOwner,
  addCar,
  toggleCarAvaliability,
  deleteCar,
  getOwnerCars,
  getDashboardData,
  updateUserImage,
} = require("../controller/ownerController");
const { protectAuthorize } = require("../middleware/userMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const ownerRoutes = express.Router();

ownerRoutes.post("/change-role", protectAuthorize, changeRoleToOwner);
ownerRoutes.post(
  "/add-car",
  uploadMiddleware.single("image"),
  protectAuthorize,
  addCar
);
ownerRoutes.get("/cars", protectAuthorize, getOwnerCars);
ownerRoutes.post("/toggle-car", protectAuthorize, toggleCarAvaliability);
ownerRoutes.post("/delete-car", protectAuthorize, deleteCar);

ownerRoutes.get("/dashboard", protectAuthorize, getDashboardData);
ownerRoutes.post(
  "/update-image",
  uploadMiddleware.single("image"),
  protectAuthorize,
  updateUserImage
);

module.exports = ownerRoutes;
