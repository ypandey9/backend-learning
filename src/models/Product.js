// Import mongoose so we can define schema and interact with MongoDB
const mongoose = require("mongoose");


// Define the structure of the Product document
const productSchema = new mongoose.Schema({

  // Product name
  // required means MongoDB will reject the document if missing
  name: {
    type: String,
    required: true
  },

  // Product price
  // Number type because we will perform calculations later
  price: {
    type: Number,
    required: true
  },

  // Stock quantity available in warehouse
  stock: {
    type: Number,
    required: true,
    default: 0 // if not provided it becomes 0
  },

  // Optional product description
  description: {
    type: String
  }

}, 
{
  // Automatically create:
  // createdAt
  // updatedAt
  timestamps: true
});


// Export model so controllers can use it
module.exports = mongoose.model("Product", productSchema);