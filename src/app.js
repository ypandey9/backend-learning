// Import product routes
const helmet = require("helmet");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
//const orderQueue = require("../queues/orderQueue");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middleware/errorMiddleware");


const app = express();
app.set("trust proxy", 1);
// Security headers
app.use(helmet());

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(cookieParser());


const limiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100, // max 100 requests per IP

  message: {
    message: "Too many requests, please try again later"
  }

});

app.use(limiter);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// Mount routes under /api/products
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);


const { protect } = require("./middleware/authMiddleware");

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
