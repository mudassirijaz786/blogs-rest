const express = require("express");
const customers = require("../routes/customers");
const contactUs = require("../routes/contactUs");
const admin = require("../routes/admins");
const service = require("../routes/services");
const serviceProvider = require("../routes/serviceProviders");
const address = require("../routes/addresses");
const company = require("../routes/companies");
const companyService = require("../routes/companyServices");
const category = require("../routes/categories");
const tacs = require("../routes/tacs.js");
const faqs = require("../routes/faqs.js");
const users = require("../routes/users.js");

const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/customer", customers);
  app.use("/api/contactUs", contactUs);
  app.use("/api/admin", admin);
  app.use("/api/service", service);
  app.use("/api/company", company);
  app.use("/api/address", address);
  app.use("/api/companyService", companyService);
  app.use("/api/category", category);
  app.use("/api/serviceProvider", serviceProvider);
  app.use("/api/tacs", tacs);
  app.use("/api/faqs", faqs);
  app.use("/api/users", users);

  app.use(error);
};
