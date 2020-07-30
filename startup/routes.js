const express = require("express");
const cookieParser = require("cookie-parser");

const contactUs = require("../routes/contactUs");
const admin = require("../routes/admins");
const service = require("../routes/services");
const expertService = require("../routes/expertServices");
const expert = require("../routes/experts");
const appointment = require("../routes/appointments");
const category = require("../routes/categories");
const notification = require("../routes/notifications");
const tacs = require("../routes/tacs.js");
const faqs = require("../routes/faqs.js");
const users = require("../routes/users.js");
const employee = require("../routes/employees.js");

const error = require("../middleware/error");
// const { Appointment } = require("../models/appointment");

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/contactUs", contactUs);
  app.use("/api/appointment", appointment);
  app.use("/api/admin", admin);
  app.use("/api/service", service);
  app.use("/api/expertService", expertService);
  app.use("/api/expert", expert);
  app.use("/api/category", category);
  app.use("/notifications", notification);
  app.use("/api/tacs", tacs);
  app.use("/api/faqs", faqs);
  app.use("/api/users", users);
  app.use("/api/employee", employee);

  app.use(error);
};
