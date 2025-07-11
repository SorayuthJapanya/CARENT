import React, { useCallback } from "react";
import { useState } from "react";
import { assets } from "../assets/assets/assets";
import { useEffect } from "react";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBooking = () => {
  const { axios, user, currency } = useAppContext();
  const [booking, setBooking] = useState([]);

  const fetchMyBooking = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings/user-bookings");
      if (data.success) {
        setBooking(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  }, [axios]);

  useEffect(() => {
    user && fetchMyBooking();
  }, [user, fetchMyBooking]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your car bookings"
        align="left"
      />
      <div>
        {booking.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Images + info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking.car.image}
                  alt="car-image"
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-gray-500">
                {booking.car.year} • {booking.car.model} •{" "}
                {booking.car.location}{" "}
              </p>
            </div>

            {/* Booking details */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/14 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  }`}
                >
                  {booking.status}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  alt="calendar"
                  className="size-4 mt-1"
                />
                <div className="ml-2">
                  <p>Rental Period</p>
                  <p>
                    {booking.pickupDate?.split("T")[0] || "-"} -{" "}
                    {booking.returnDate?.split("T")[0] || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  alt="location"
                  className="size-4 mt-1"
                />
                <div className="ml-2">
                  <p>Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency} {booking.price}
                </h1>
                <p>Backed on {booking.createdAt.split("T")[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBooking;
