const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const Car = require("../model/Car");

const generateToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    // step 1: Require
    const { name, email, password } = req.body;

    // Debugging
    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "All feild are required" });
    }

    // CheckExists
    const userExsits = await User.findOne({ email });
    if (userExsits) {
      return res.json({ success: false, message: "User already exists" });
    }

    // GenSalt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Gen token
    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error in registerUser controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Require
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "All feild are required" });
    }
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    // checl pass
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    // gen token
    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error in loginUser controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log("Error in getUserData controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.log("Error in getUserData controller:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};
