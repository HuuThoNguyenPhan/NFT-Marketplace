const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  nftmarketplaceAddress: {
    type: String,
  },
  nftFactory: {
    type: String,
  },
  auctionAddress: {
    type: String,
  },
  transferFundsAddress: {
    type: String,
  },
});

module.exports = mongoose.model("Address", addressSchema);
