const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    genealogy: {
        type: String,
    }
})

module.exports = mongoose.model("Like", likeSchema);