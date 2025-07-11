const User = require("../model/User");
const jwt = require("jsonwebtoken");

exports.protectAuthorize = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ success: false, message: "No Authorized" });
  }
  try {
    const userId = jwt.decode(token, process.env.JWT_SECRET);
    if (!userId) {
      return res.json({ success: false, message: "Invalid Authorized" });
    }
    req.user = await User.findById(userId.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    next();
  } catch (error) {
    console.log("Error in protectAuthorize middleware:", error);
    res.json({ success: false, message: "Internal Server" });
  }
};
