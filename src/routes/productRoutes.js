const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
// Import express to create router
const express = require("express");

// Create router instance
const router = express.Router();

// Import controller functions
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");


// Route to create product
//router.post("/", createProduct);


// Route to get all products
router.get("/", getProducts);


// Route to get single product
router.get("/:id", getProductById);


// Route to update product
//router.put("/:id", updateProduct);


// Route to delete product
//router.delete("/:id", deleteProduct);

router.post("/", protect, authorize("admin"), createProduct);

router.put("/:id", protect, authorize("admin"), updateProduct);

router.delete("/:id", protect, authorize("admin"), deleteProduct);


// Export router
module.exports = router;