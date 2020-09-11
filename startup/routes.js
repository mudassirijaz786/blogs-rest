const express = require("express");
const cookieParser = require("cookie-parser");
const blog = require("../routes/blogs");
const author = require("../routes/authors");
const comment = require("../routes/comments");
const book = require("../routes/books");

const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/blog", blog);
  app.use("/api/comment", comment);
  app.use("/api/author", author);
  app.use("/api/book", book);

  app.use(error);
};
