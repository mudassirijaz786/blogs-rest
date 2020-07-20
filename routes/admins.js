const admin = require("../middleware/admin");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const express = require("express");
const { Admin, validate } = require("../models/admin");
const router = express.Router();
const Joi = require("joi");

router.get("/", admin, async (req, res) => {
  try {
    const admin = await Admin.find().select("-password");
    if (admin) {
      res.json({ data: admin });
    } else {
      res.status(404).json({ message: "Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/me/:id", admin, async (req, res) => {
  try {
    const found = await Admin.findById(req.params.id).select("-password");
    if (found) {
      res.json({ data: found });
    } else {
      res
        .status(404)
        .json({ message: "Admin with given Id is not found in system!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password." });
    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Invalid email or password." });
    const token = admin.generateAuthToken();
    res.header("x-auth-token", token);
    res.send({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      res.status(409).json({
        message: `Admin with an email ${req.body.email} is already registered`,
      });
    } else {
      admin = new Admin(_.pick(req.body, ["name", "password", "email"]));
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);
      await admin.save();
      const token = admin.generateAuthToken();
      res.header("x-auth-token", token).json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// function to validate login
validateLogin = (req) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().alphanum().min(8).max(32).required(),
  };

  return Joi.validate(req, schema);
};

module.exports = router;
