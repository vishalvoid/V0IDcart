const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name."],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product Price"],
    maxLength: [8, "price length cannot be greater than 8 characters."],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String,
      default: "default.png",
    },
  ],
  category: {
    type: String,
    required: [true, "please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product Stock"],
    maxLength: [4, "Stock cannot be more than 9999"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: [true, "reviewer name not found"],
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: [true, "Please type atleast 2 words"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  skuid: {
    type: Number,
    required: [true, "SKU Id is a required field."],
    unique: [true, "two SKU-id cannot be same."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);
