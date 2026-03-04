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

    // Fetch all products from database
    const products = await Product.find();

    res.json(products);

  } catch (error) {

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