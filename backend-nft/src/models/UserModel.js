const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxLength: [50, "Tên tối đa 20 ký tự"],
  },
  description: {
    type: String,
    maxlength: [250, "Description is can not exceed than 250 characters"],
  },
  addressWallet: {
    type: String,
  },
  reason: {
    type: String,
    maxlength: [250, "Description is can not exceed than 250 characters"],
  },
  contact: {
    trim: true,
    type: String,
  },
  verified: {
    type: String,
    default: "not_verified",
  },
  cart: [
    {
      tokenId: {
        type: String,
      },
      name: {
        type: String,
      },
      image: {
        type: String,
      },
      price: {
        type: Number,
      },
      typeFile:{
        type: String,
      },
      royalties: {
        type: String,
      }, 
      author: {
        type: String,
      }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
