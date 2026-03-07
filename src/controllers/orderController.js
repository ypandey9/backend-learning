
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

const Order = require("../models/Order");
const Product = require("../models/Product");
const orderQueue = require("../queues/orderQueue");

exports.createOrder = asyncHandler(async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // transaction logic here

    await session.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully"
    });

  } catch (error) {

    await session.abortTransaction();
    throw error;

  } finally {

    session.endSession();

  }

});


  // GET ORDERS OF CURRENT USER

exports.getMyOrders = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("items.product", "name price");

  res.json(orders);

});


// ADMIN: GET ALL ORDERS

exports.getAllOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name price");

  res.json(orders);

});