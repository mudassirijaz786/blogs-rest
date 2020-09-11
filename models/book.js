const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  ],
});

const Book = mongoose.model("Book", bookSchema);

exports.Book = Book;
