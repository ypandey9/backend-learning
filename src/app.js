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

module.exports = app;
