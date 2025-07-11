const imagekit = require("../config/imagekit");
const Booking = require("../model/Booking");
const Car = require("../model/Car");
const User = require("../model/User");
const fs = require("fs");

// Api to Change Role
exports.changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list car" });
  } catch (error) {
    console.log("Error in changeRoleToOwner controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

// Api CRUD Car
// Addcar
exports.addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const existingCar = await Car.findOne({
      owner: _id,
      brand: car.brand,
      model: car.model,
      year: car.year,
    });

    if (existingCar) {
      return res.json({ success: false, message: "Car already exists" });
    }

    // Uploaf to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const image = response.url;
    const imageId = response.fileId;

    const addNewCar = await Car.create({
      ...car,
      owner: _id,
      image,
      imageId,
    });

    console.log(addNewCar);
    res.json({ success: true, message: "Car Added Successfully" });
  } catch (error) {
    console.log("Error in addCar controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

// Get Owner Car
exports.getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log("Error in getOwnerCars controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

// Change car avaliability
exports.toggleCarAvaliability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    console.log(carId);

    const car = await Car.findById(carId);

    console.log(_id);

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ sucess: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;

    await car.save();

    res.json({ success: true, message: "Avaliability Toggled" });
  } catch (error) {
    console.log("Error in toggleCarAvaliability controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

// Delete owner car
exports.deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    console.log(carId)
    const car = await Car.findById(carId);


    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ sucess: false, message: "Unauthorized" });
    }
    if (car.imageId) {
      try {
        await imagekit.deleteFile(car.imageId);
      } catch (error) {
        console.log("⚠️ Failed to delete image from ImageKit:", err.message);
        res.json({ success: false, message: "Internal Server" });
      }
    }

    await Car.findByIdAndDelete(carId);

    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCar controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthrized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });

    const confirmedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totelCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      confirmedBookings: confirmedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log("Error in getDashboardData controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

exports.updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const user = await User.findById(_id);

    if (user.imageId && user.imageId.trim() !== "") {
      try {
      } catch (error) {
        res.json();
        console.warn("⚠️ Failed to delete previous image:", err.message);
      }
    }

    // Upload to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const image = response.url;
    const imageId = response.fileId;

    await User.findByIdAndUpdate(_id, {
      image,
      imageId,
    });

    res.json({ success: true, message: "Update Successfully" });
  } catch (error) {
    console.log("Error in updateUserImage controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};
