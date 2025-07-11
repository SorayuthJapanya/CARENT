const express = require("express");
const {
  checkAvaliabilityOfCar,
  createBooking,
  getUserBooking,
  getOwnerBooking,
  updateBookingStatus,
} = require("../controller/booking.controller");
const { protectAuthorize } = require("../middleware/user.middleware");

const bookingRoutes = express.Router();

bookingRoutes.post("/check-avaliability", checkAvaliabilityOfCar);
bookingRoutes.post("/create", protectAuthorize, createBooking);
bookingRoutes.get("/user-bookings", protectAuthorize, getUserBooking);
bookingRoutes.get("/owner-bookings", protectAuthorize, getOwnerBooking);
bookingRoutes.post("/change-status", protectAuthorize, updateBookingStatus);

module.exports = bookingRoutes;
