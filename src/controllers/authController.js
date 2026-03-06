const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

exports.register = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email
  });

});




// 🔥 LOGIN
exports.login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  // 1️⃣ Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // 2️⃣ Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // 3️⃣ Generate Access Token
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // 4️⃣ Generate Refresh Token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );

  // 5️⃣ Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // 6️⃣ Send response
  res.json({
    message: "Login successful",
    accessToken,
    refreshToken
  });

});


exports.refresh = asyncHandler(async (req, res) => {

  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }

  // Generate new access token
  const newAccessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    accessToken: newAccessToken
  });

});


exports.logout = asyncHandler(async (req, res) => {

  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error("Refresh token required");
  }

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({
    message: "Logged out successfully"
  });

});