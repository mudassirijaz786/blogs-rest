const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

authorSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "authors",
});

authorSchema.set("toJSON", { getters: true, virtuals: true });

const Author = mongoose.model("Author", authorSchema);

exports.Author = Author;
