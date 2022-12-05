const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  comments: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  postID: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", CommentSchema);
