const Booking = require("../model/Booking");
const Car = require("../model/Car");

const checkAvaliability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: new Date(returnDate) },
    returnDate: { $gte: new Date(pickupDate) },
  });
  return bookings.length === 0; // true = ว่าง, false = ไม่ว่าง
};

// Car Avaliable
exports.checkAvaliabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    if (!location || !pickupDate || !returnDate) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const cars = await Car.find({ location, isAvailable: true });

    // เช็คทีละคันด้วย async function
    const availableCarPromises = cars.map(async (car) => {
      const isAvailable = await checkAvaliability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable };
    });

    const allCarsWithAvailability = await Promise.all(availableCarPromises);

    const availableCars = allCarsWithAvailability.filter(
      (car) => car.isAvailable
    );

    res.json({ success: true, avaliableCars: availableCars });
  } catch (error) {
    console.log("Error in checkAvaliability controller:", error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

// create booking
exports.createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;
    const isAvailable = await checkAvaliability(car, pickupDate, returnDate);

    if (!isAvailable) {
      return res.json({ status: false, message: "Car's not avaliable" });
    }

    // Fix: pass car as string, not object
    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));

    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate: picked,
      returnDate: returned,
      price,
    });

    res.json({ success: true, message: "Booking succesfully" });
  } catch (error) {
    console.log("Error in createBooking controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

// User booking
exports.getUserBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log("Error in getUserBooking controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

// Owner bookings
exports.getOwnerBooking = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-password")
      .sort({ createAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log("Error in getUserBooking controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;
    const booking = await Booking.findById(bookingId);

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log("Error in getUserBooking controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};
