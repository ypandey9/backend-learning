// Import Product model to interact with database
const Product = require("../models/Product");


// CREATE PRODUCT
exports.createProduct = async (req, res) => {

  try {

    // Extract fields sent from client request body
    const { name, price, stock, description } = req.body;

    // Create new product document in MongoDB
    const product = await Product.create({
      name,
      price,
      stock,
      description
    });

    // Send response back to client
    res.status(201).json({
      message: "Product created",
      product
    });

  } catch (error) {

    // If something fails return server error
    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};



// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {

  try {

    // Extract query parameters from URL
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Filtering object
    const filter = {};

    // Price filtering
    if (req.query.minPrice || req.query.maxPrice) {

      filter.price = {};

      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice);
      }

    }

    // Search by product name
    if (req.query.search) {

      filter.name = {
        $regex: req.query.search,
        $options: "i"
      };

    }

    // Sorting
    let sort = {};

    if (req.query.sort) {

      if (req.query.sort === "price") {
        sort.price = 1;
      }

      if (req.query.sort === "-price") {
        sort.price = -1;
      }

    }

    // Fetch products with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await Product.countDocuments(filter);

    res.json({

      page,
      limit,
      total,

      products

    });

  }

  catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {

  try {

    // req.params.id comes from URL like /products/:id
    const product = await Product.findById(req.params.id);

    // If product not found return 404
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};



// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {

  try {

    // find product and update with new values
    const product = await Product.findByIdAndUpdate(
      req.params.id, // product id
      req.body,      // fields to update
      { new: true }  // return updated document
    );

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};



// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {

  try {

    // delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};