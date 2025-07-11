import React from "react";
import Title from "../../components/owner/Title";
import { useState } from "react";
import { assets } from "../../assets/assets/assets";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCar = () => {
  const { currency, isOwner, axios } = useAppContext();
  const [car, setCar] = useState([]);

  const fetchOwnerCar = async () => {
    const { data } = await axios.get("/api/owner/cars");
    try {
      if (data.success) {
        setCar(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const toggleAvailability = async (carId) => {
    console.log(carId);

    const { data } = await axios.post("/api/owner/toggle-car", { carId });
    console.log(data);
    try {
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCar();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const deleteCar = async (carId) => {
    console.log(carId);
    const confirm = window.confirm("Are you sure you want to delete this car?");
    if (!confirm) return null;
    const { data } = await axios.post("/api/owner/delete-car", { carId });
    try {
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCar();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCar();
  }, [isOwner]);

  return (
    <div className="px-4 py-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform"
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr className="">
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {car.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt="car-image"
                    className="size-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-600">
                      {car.seating_capacity} • {car.transmission}
                    </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      car.isAvailable
                        ? "text-green-500 bg-green-100"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Avaliable" : "Unavaliable"}
                  </span>
                </td>
                <td className="p-3 flex items-center">
                  <img
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt="eyes"
                    className="cursor-pointer"
                    onClick={() => toggleAvailability(car._id)}
                  />
                  <img
                    src={assets.delete_icon}
                    alt="delete"
                    className="cursor-pointer"
                    onClick={() => deleteCar(car._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCar;
