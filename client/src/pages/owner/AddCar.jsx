import React from "react";
import { useState } from "react";
import Title from "../../components/owner/title";
import { assets } from "../../assets/assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const AddCar = () => {
  const { axios, currency, navigate } = useAppContext();
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const handleAddNewCar = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return null;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      console.log(formData);
      const { data } = await axios.post("/api/owner/add-car", formData);
      if (data.success) {
        toast.success(data.message);
        setCar(null);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
      navigate("/owner");
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <form
        onSubmit={handleAddNewCar}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Car Images */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="car-image"
              className="h-14 rounded cursor-pointer"
            />
            <input
              type="file"
              name="car-image"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <p className="text-gray-500 text-sm">Upload a picture of your car</p>
        </div>

        {/* Car brand & model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW, Mercedes, Audi..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g. X5, E-Class, M4..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Car Year Daily Price & category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="2025"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              placeholder="100"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Category</label>
            <input
              type="text"
              placeholder="Sedan"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
            />
          </div>
        </div>

        {/* Car Transmission, Fuel Type & Seating Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Transmission</label>
            <input
              type="text"
              placeholder="Automatic"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.transmision}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <input
              type="text"
              placeholder="Disel"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder="5"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({ ...car, seating_capacity: e.target.value })
              }
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col w-full">
          <label>Location</label>
          <select
            name="location"
            id="location"
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            value={car.location}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">Select a location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="Describe your car, its condition, and any notable details..."
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
          <img src={assets.tick_icon} alt="tick-icon" />
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "List Your Car"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
