const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["https://carent-umber.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello Server Project!");
});
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/bookings", bookingRoutes);

const startServer = async () => {
  try {
    await connectDB(); // รอให้เชื่อม MongoDB เสร็จก่อน
    app.listen(port, () => {
      console.log(`✅ Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
