const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
  created_at: {
    type: String,
    required: true,
    default: new Date(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
