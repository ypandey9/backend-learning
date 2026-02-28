const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


const { protect } = require("./middleware/authMiddleware");

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

module.exports = app;
