const express = require("express");
const customers = require("../routes/customers");

const error = require("../middleware/error");

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/customer", customers);

  app.use(error);
};
