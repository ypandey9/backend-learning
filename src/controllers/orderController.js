// Import models
const Order = require("../models/Order");
const Product = require("../models/Product");


// CREATE ORDER
exports.createOrder = async (req, res) => {

  try {

    // Get user id from authentication middleware
    const userId = req.user._id;

    // Extract items sent by client
    const { items } = req.body;

    // This will store calculated total price
    let totalAmount = 0;


    // Loop through each item
    for (const item of items) {

      // Find product from database
      const product = await Product.findById(item.product);

      if (!product) {

        return res.status(404).json({
          message: "Product not found"
        });

      }

      // Check stock availability
      if (product.stock < item.quantity) {

        return res.status(400).json({
          message: "Not enough stock"
        });

      }

      // Calculate total price
      totalAmount += product.price * item.quantity;

    }


    // Create order document
    const order = await Order.create({

      user: userId,

      items: items,

      totalAmount

    });


    // Reduce product stock
    for (const item of items) {

      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { stock: -item.quantity }
        }
      );

    }


    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  }

  catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};