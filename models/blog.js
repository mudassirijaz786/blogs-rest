const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

exports.Blog = Blog;
