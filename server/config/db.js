const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected");
    });
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("MongoDB connect failed:", error.message);
  }
};

module.exports = connectDB;
