// Import Product model to interact with database
const Product = require("../models/Product");
const redisClient = require("../config/redis");
const asyncHandler = require("../utils/asyncHandler");

// CREATE PRODUCT
exports.createProduct = asyncHandler(async (req, res) => {

  const { name, price, stock, description } = req.body;

  const product = await Product.create({
    name,
    price,
    stock,
    description
  });

  // Clear cached products
  await redisClient.del("products");

  res.status(201).json({
    message: "Product created",
    product
  });

});



exports.getProducts = asyncHandler(async (req, res) => {

  const cacheKey = "products";

  const cachedProducts = await redisClient.get(cacheKey);

  if (cachedProducts) {

    console.log("Serving from cache");

    return res.json(JSON.parse(cachedProducts));

  }

  const products = await Product.find();

  await redisClient.setEx(
    cacheKey,
    60,
    JSON.stringify(products)
  );

  console.log("Serving from database");

  res.json(products);

});


// GET SINGLE PRODUCT
exports.getProductById = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);

});



// UPDATE PRODUCT
exports.updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await redisClient.del("products");

  res.json(product);

});


// DELETE PRODUCT
exports.deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await redisClient.del("products");

  res.json({
    message: "Product deleted"
  });

});