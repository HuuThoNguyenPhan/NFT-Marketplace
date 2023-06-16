const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  addressWallet: {
    type: String,
  },
  genealogy: {
    type: String,
  },
  option: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Report", reportSchema);
