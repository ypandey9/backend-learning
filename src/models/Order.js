// Import mongoose so we can define schema
const mongoose = require("mongoose");


// Define structure of Order document
const orderSchema = new mongoose.Schema({

  // Reference to the user who placed the order
  user: {

    // ObjectId links to another collection
    type: mongoose.Schema.Types.ObjectId,

    // This tells mongoose the reference collection
    ref: "User",

    required: true
  },

  // Items included in the order
  items: [

    {

      // Reference to product
      product: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      // Quantity ordered
      quantity: {
        type: Number,
        required: true
      },

      // Price snapshot at time of order
      // Important because product price may change later
      price: {
        type: Number,
        required: true
      }

    }

  ],

  // Total order value
  totalAmount: {
    type: Number,
    required: true
  },

  // Order status
  status: {

    type: String,

    enum: ["pending", "completed", "cancelled"],

    default: "pending"
  }

},
{
  timestamps: true
});


// Export model
module.exports = mongoose.model("Order", orderSchema);