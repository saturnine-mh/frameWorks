const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  album: {
    type: String,
    require: true,
  },
  originalSize: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  
  compressedSize: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  compressedURL: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Post", PostSchema);
