const express = require("express");
const cookieParser = require("cookie-parser");
const service = require("../routes/services");
const category = require("../routes/categories");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/service", service);
  app.use("/api/category", category);
  app.use(error);
};
