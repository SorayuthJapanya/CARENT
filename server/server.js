const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const ownerRoutes = require("./routes/owner.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello Server Project!");
});
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
