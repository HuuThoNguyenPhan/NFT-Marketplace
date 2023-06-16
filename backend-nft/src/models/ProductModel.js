const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxLength: [50, "Tên tối đa 50 ký tự"],
  },
  description: {
    type: String,
    maxlength: [2000, "Description is can not exceed than 1000 characters"],
  },
  image: { type: String },
  typeFile: { type: String },
  size: {
    type: Number,
  },
  breed: {
    type: String,
  },
  limit: {
    type: Number,
  },
  genealogy: {
    type: String,
  },
  only: {
    type: Boolean,
    default: true,
  },
  topics: {
    type: Array,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
