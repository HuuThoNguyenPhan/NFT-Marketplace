const mongoose = require("mongoose");

const Topic = new mongoose.Schema({
  topicName: {
    unique: true,
    type: String,
  },
});

module.exports = mongoose.model("Topic", Topic);