const mongoose = require("mongoose");

const contentReportSchema = new mongoose.Schema({
  option: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("ContentReport", contentReportSchema);
