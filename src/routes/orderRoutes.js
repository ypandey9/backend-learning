const express = require("express");

const router = express.Router();

// Import controller
const { createOrder } = require("../controllers/orderController");

// Import auth middleware
const { protect } = require("../middleware/authMiddleware");


// Only logged-in users can place orders
router.post("/", protect, createOrder);


module.exports = router;