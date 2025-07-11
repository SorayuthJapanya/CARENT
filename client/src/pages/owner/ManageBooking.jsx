import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Title from "../../components/owner/title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBooking = () => {
  const { currency, axios } = useAppContext();
  const [booking, setBooking] = useState([]);

  const fetchOwnerBooking = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner-bookings");
      if (data.success) {
        setBooking(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  }, [axios]);

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        fetchOwnerBooking();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchOwnerBooking();
  }, [fetchOwnerBooking]);

  return (
    <div className="px-4 py-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses"
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr className="">
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {booking.map((booking, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking.car.image}
                    alt="car-image"
                    className="size-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {booking.car.brand} {booking.car.model}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">
                  {new Date(booking.pickupDate).toLocaleDateString()} To{" "}
                  {new Date(booking.returnDate).toLocaleDateString()}
                </td>

                <td className="">
                  {currency} {booking.price}
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === "confirmed"
                        ? "text-green-500 bg-green-100"
                        : booking.status === "pending"
                        ? "text-yellow-500 bg-yellow-100"
                        : "text-violet-500 bg-violet-100"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    name="status"
                    id="status"
                    className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    value={booking.status}
                    onChange={(e) =>
                      changeBookingStatus(booking._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooking;
