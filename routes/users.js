const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const admin = require("../middleware/admin");
const _ = require("lodash");
const express = require("express");
const { User, validate } = require("../models/user.js");
const router = express.Router();
const Joi = require("joi");
const sendEmailForResetPassword = require("../utils/emailService");

router.get("/", auth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ data: users });
});

router.get("/me/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password ");
    if (user) {
      res.json({ data: user });
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
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password." });
    const token = user.generateAuthToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  //   try {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(401).json({
      error: `User with email ${req.body.email} is already registered`,
    });
  user = new User(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "gender",
      "address",
      "role",
      "email",
      "password",
      "mobileNumber",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .json({ message: "Registered successfully" });
  //   } catch (error) {
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const userId = await User.findById(req.body._id);
    if (!userId) {
      res.status(404).json({
        message: `User not found in system`,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.newPassword, salt);
      const user = await User.findByIdAndUpdate(
        req.body._id,
        {
          $set: {
            password,
          },
        },
        { new: true }
      );
      const token = user.generateAuthToken();
      res.json({ token });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/resetPassword/sendEmail", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: `User with ${req.body.email} not found in system`,
      });
    } else {
      sendEmailForResetPassword(
        email,
        "Reset Your password",
        "Follow the link to generate code ",
        user._id
      );
    }
    res.json({ message: "An email with the link has been forwarded to you" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/userRemove/:id", admin, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      res.json({ message: "User has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/searchUser/:id", admin, async (req, res) => {
  try {
    const users = await User.find();
    const query = req.params.id.toLowerCase();
    var foundedUser = [];
    users.forEach((user) => {
      if (user.name.toLowerCase().includes(query)) {
        foundedUser.push(user);
      }
    });
    res.json({ data: foundedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/userUpdate/:id", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const found = await User.findById(req.params.id);
    if (!found) {
      res.status(404).json({ message: "Invalid id. user not found" });
    } else {
      const users = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({
        message: "user has been updateed successfully",
        data: users,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/userBlocking/:id", admin, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ message: `User not found` });
    } else {
      await User.updateOne(
        { _id: req.params.id },
        { $set: { blocked: true } },
        { new: true }
      );
      res.json({ message: `${user.name} is blocked` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
