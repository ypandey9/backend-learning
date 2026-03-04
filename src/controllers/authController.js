const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
  console.error("Register Error:", error);
  res.status(500).json({ 
    message: "Server error",
    error: error.message
  });
}
};

const jwt = require("jsonwebtoken");

// 🔥 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const accessToken = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

const refreshToken = jwt.sign(
  { id: user._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRES }
);

user.refreshToken = refreshToken;
await user.save();

res.json({
  accessToken,
  refreshToken
});

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.refresh = async (req, res) => {

  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {

    res.status(403).json({ message: "Invalid refresh token" });

  }

};

exports.logout = async (req, res) => {

  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({ message: "Logged out successfully" });

};