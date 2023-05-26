const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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
