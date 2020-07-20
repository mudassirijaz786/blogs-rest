const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const admin = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const express = require("express");
const { Customer, validate } = require("../models/customer");
const router = express.Router();
const Joi = require("joi");
const sendEmailForResetPassword = require("../utils/emailService");

router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().select("-password");
  res.json({ data: customers });
});

router.get("/me/:id", auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select(
      "-password "
    );
    if (customer) {
      res.json({ data: customer });
    } else {
      res.status(404).json({ message: "Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = await Customer.findOne({ email: req.body.email });
    if (!customer)
      return res.status(400).json({ message: "Invalid email or password." });
    const validPassword = await bcrypt.compare(
      req.body.password,
      customer.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password." });
    const token = customer.generateAuthToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    let customer = await Customer.findOne({ email: req.body.email });
    if (customer)
      return res.status(401).json({
        error: `Customer with email ${req.body.email} is already registered`,
      });
    customer = new Customer(
      _.pick(req.body, ["name", "email", "password", "phoneNumber"])
    );
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);
    await customer.save();

    const token = customer.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(customer, ["_id", "name", "email", "phoneNumber"]));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/resetPassword/newPassword", async (req, res) => {
  try {
    const customerId = await Customer.findById(req.body._id);
    if (!customerId) {
      res.status(404).json({
        message: `Customer not found in system`,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.newPassword, salt);
      const customer = await Customer.findByIdAndUpdate(
        req.body._id,
        {
          $set: {
            password,
          },
        },
        { new: true }
      );
      const token = customer.generateAuthToken();
      res.json({ token });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/resetPassword/sendEmail", async (req, res) => {
  try {
    const email = req.body.email;
    const customer = await Customer.findOne({ email });
    if (!customer) {
      res.status(404).json({
        message: `Customer with an id ${req.body.email} not found in system`,
      });
    } else {
      sendEmailForResetPassword(
        email,
        "Reset Your password",
        "Follow the link to generate code ",
        customer._id
      );
    }
    res.json({ message: "An email with the link has been forwarded to you" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/customerRemove/:id", admin, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    } else {
      res.json({ message: "Customer has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/searchCustomer/:id", admin, async (req, res) => {
  try {
    const customers = await Customer.find();
    const query = req.params.id.toLowerCase();
    var foundedCustomer = [];
    customers.forEach((customer) => {
      if (customer.name.toLowerCase().includes(query)) {
        foundedCustomer.push(customer);
      }
    });
    res.json({ data: foundedCustomer });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/customerUpdate/:id", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const found = await Customer.findById(req.params.id);
    if (!found) {
      res.status(404).json({ message: "Invalid id. customer not found" });
    } else {
      const customers = await Customer.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({
        message: "customer has been updateed successfully",
        data: customers,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/customerBlocking/:id", admin, async (req, res) => {
  try {
    const customer = await Customer.findById({ _id: req.params.id });
    if (!customer) {
      res.status(404).json({ message: `Customer not found` });
    } else {
      await Customer.updateOne(
        { _id: req.params.id },
        { $set: { blocked: true } },
        { new: true }
      );
      res.json({ message: `${customer.name} is blocked` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// function to validate login params
validateLogin = (req) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().alphanum().min(8).max(32).required(),
  };

  return Joi.validate(req, schema);
};

module.exports = router;
