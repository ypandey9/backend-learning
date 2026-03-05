const express = require("express");

const router = express.Router();

// Import controller
const { createOrder ,getMyOrders,getAllOrders} = require("../controllers/orderController");

// Import auth middleware
const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");


// Only logged-in users can place orders
router.post("/", protect, createOrder);

// user order history
router.get("/my-orders", protect, getMyOrders);

// admin order dashboard
router.get("/", protect, authorize("admin"), getAllOrders);

module.exports = router;