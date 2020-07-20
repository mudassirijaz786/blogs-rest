const express = require("express");
const customers = require("../routes/customers");
const contactUs = require("../routes/contactUs");
const admin = require("../routes/admins");
const service = require("../routes/services");
const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/customer", customers);
  app.use("/api/contactUs", contactUs);
  app.use("/api/admin", admin);
  app.use("/api/service", service);

  app.use(error);
};
