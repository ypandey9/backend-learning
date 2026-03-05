const express = require("express");

const router = express.Router();

// Import controller
const { createOrder ,getMyOrders,getAllOrders} = require("../controllers/orderController");

// Import auth middleware
const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");


// Only logged-in users can place orders
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created
 */

router.post("/", protect, createOrder);

// user order history
/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */

router.get("/my-orders", protect, getMyOrders);

// admin order dashboard
router.get("/", protect, authorize("admin"), getAllOrders);

module.exports = router;