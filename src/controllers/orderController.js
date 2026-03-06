// const mongoose = require("mongoose");

// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const orderQueue = require("../queues/orderQueue");

// exports.createOrder = async (req, res) => {

//   // Start a database session
//   const session = await mongoose.startSession();

//   // Start transaction
//   session.startTransaction();

//   try {

//     const userId = req.user._id;

//     const { items } = req.body;

//     let totalAmount = 0;

//     const orderItems = [];

//     for (const item of items) {

//       // Find product inside transaction session
//       const product = await Product.findById(item.product).session(session);

//       if (!product) {

//         throw new Error("Product not found");

//       }

//       if (product.stock < item.quantity) {

//         throw new Error("Not enough stock");

//       }

//       // Calculate total
//       totalAmount += product.price * item.quantity;

//       // Push item with price snapshot
//       orderItems.push({

//         product: product._id,
//         quantity: item.quantity,
//         price: product.price

//       });

//       // Reduce stock
//       product.stock -= item.quantity;

//       await product.save({ session });

//     }


//     // Create order inside transaction
//     const order = await Order.create([{

//       user: userId,
//       items: orderItems,
//       totalAmount

//     }], { session });

//     // Add background job
// await orderQueue.add("sendOrderEmail", {
//   orderId: order._id,
//   email: req.user.email
// });

//     // Commit transaction
//     await session.commitTransaction();

//     session.endSession();

//     res.status(201).json({

//       message: "Order placed successfully",
//       order: order[0]

//     });

//   }

//   catch (error) {

//     // Rollback transaction
//     await session.abortTransaction();

//     session.endSession();

//     res.status(500).json({

//       message: "Order failed",
//       error: error.message

//     });

//   }
  

// };

const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

const Order = require("../models/Order");
const Product = require("../models/Product");
const orderQueue = require("../queues/orderQueue");

exports.createOrder = asyncHandler(async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const userId = req.user._id;
    const { items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {

      const product = await Product.findById(item.product).session(session);

      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error("Not enough stock");
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      product.stock -= item.quantity;
      await product.save({ session });

    }

    const order = await Order.create([{
      user: userId,
      items: orderItems,
      totalAmount
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Add background job AFTER commit
    await orderQueue.add("sendOrderEmail", {
      orderId: order[0]._id,
      email: req.user.email
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0]
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    throw error;

  }

});

  // GET ORDERS OF CURRENT USER

exports.getMyOrders = async (req, res) => {

  try {

    // req.user comes from JWT middleware
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })

      // populate user details
      .populate("user", "name email")

      // populate product details inside items
      .populate("items.product", "name price");

    res.json(orders);

  }

  catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};

// ADMIN: GET ALL ORDERS

exports.getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()

      .populate("user", "name email")

      .populate("items.product", "name price");

    res.json(orders);

  }

  catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};