const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxLength: [50, "Tên tối đa 20 ký tự"],
  },
  description: {
    type: String,
    maxlength: [250, "Description is can not exceed than 250 characters"],
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
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
