const express = require("express");
const cookieParser = require("cookie-parser");
const admin = require("../routes/admins");
const service = require("../routes/services");
const category = require("../routes/categories");
const users = require("../routes/users.js");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/admin", admin);
  app.use("/api/service", service);
  app.use("/api/category", category);
  app.use("/api/users", users);
  app.use(error);
};
