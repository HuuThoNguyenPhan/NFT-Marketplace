const mongoose = require("mongoose");

const contentReportSchema = new mongoose.Schema({
  option: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ContentReport", contentReportSchema);
