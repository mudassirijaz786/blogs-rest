const express = require("express");
const bcrypt = require("bcryptjs");

const Joi = require("joi");
const router = express.Router();

const { User, validate } = require("../models/user.js");
const { upload } = require("../utils/azureFileService");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const sendEmailForResetPassword = require("../utils/emailService");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", auth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ data: users });
});

router.get("/me/:id", validateObjectId, auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password ");
    if (user) {
      res.status(200).json({ statusCode: 200, data: user });
    } else {
      res.status(404).json({ statusCode: 404, message: "Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("called");
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid email or password." });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid email or password." });
    const token = user.generateAuthToken();
    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      statusCode: 200,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user)
      return res.status(401).json({
        statusCode: 401,
        message: `User with email ${req.body.email} is already registered`,
      });
    user = new User(req.body);
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.status(200).json({
      message: "User registered successfully",
      statusCode: 200,
      data: user,
      token,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.post("/resetPassword/:id", validateObjectId, async (req, res) => {
  try {
    const userId = await User.findById(req.params.id);
    if (!userId) {
      res.status(404).json({
        statusCode: 404,
        message: "User not found in system",
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
      res.status(200).json({
        statusCode: 200,
        message: "Password has been reset",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.post("/resetPassword/sendEmail", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        statusCode: 404,
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
    res.status(200).json({
      statusCode: 200,
      message: "An email with the link has been forwarded to you",
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

// below are extra ... ignore for now but don't delete or remove
router.delete("/userRemove/:id", admin, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    } else {
      res.json({
        statusCode: 200,
        message: "User has been deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.get("/searchUser/:id", validateObjectId, admin, async (req, res) => {
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
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

router.put("/updateUser/:id", [validateObjectId, auth], async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res
    //     .status(400)
    //     .json({ statusCode: 400, message: error.details[0].message });
    const found = await User.findById(req.params.id);
    if (!found) {
      res.status(404).json({ message: "Invalid id. user not found" });
    } else {
      const body = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: body },
        { new: true }
      );
      res.json({
        message: "user has been updateed successfully",
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/deactivate/:id", [validateObjectId], async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: `User not found` });
  } else {
    await User.findByIdAndUpdate(
      req.params.id,
      { $set: { blocked: true } },
      { new: true }
    );
    // console.log(user);
    res.json({ message: user.firstName + " is blocked", statusCode: 200 });
  }
});

router.put("/changeAvatar/:id", upload.any(), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ statusCode: 404, message: "User not found" });
  } else {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          imageUrl: req.files[0].url,
        },
      },
      { new: true }
    );
    res.json({ status: 200, message: "Profile Picture updated successfully." });
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
/*
const express = require("express");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Joi = require("joi");
const router = express.Router();

const { User, validate } = require("../models/user.js");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const sendEmailForResetPassword = require("../utils/emailService");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", auth, async (req, res, next) => {
  const users = await User.find().select("-password");
  if (users.length > 0) {
    req.data = users;
    req.statusCode = 200;
  } else {
    req.statusCode = 404;
    req.message = "Could not find any users";
  }
  next();
});

router.get("/me/:id", validateObjectId, auth, async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password ");
  if (user) {
    req.data = user;
    req.statusCode = 200;
  } else {
    req.message = "User not found. Invalid id.";
    req.statusCode = 404;
  }
  next();
});

router.post("/login", async (req, res, next) => {
  const { error } = validateLogin(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  if (error) {
    req.statusCode = 400;
    req.data = error.details;
    next();
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    // return res.status(400).json({ message: "Invalid email or password." });
    req.statusCode = 400;
    req.message = "Invalid email or password.";
    next();
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  // return res.status(400).json({ message: "Invalid email or password." });

  if (!validPassword) {
    req.statusCode = 400;
    req.message = "Invalid email or password.";
    next();
  }
  const token = user.generateAuthToken();
  req.statusCode = 200;
  user.password = "";
  req.data = { token, user };
  next();
  // res
  //   // .cookie("token", token, { maxAge: 86400 })
  //   .json({
  //     message: "User loged in successfully",
  //     data: user,
  //     token: token,
  //   });
});

router.post("/register", async (req, res, next) => {
  const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  if (error) {
    req.statusCode = 400;
    req.data = error.details;
    next();
  }
  let user = await User.findOne({ email: req.body.email }).exec();
  // if (user)
  //   return res.status(401).json({
  //     error: `User with email ${req.body.email} is already registered`,
  //   });
  if (user) {
    // return res.status(400).json({ message: "Invalid email or password." });
    req.statusCode = 400;
    req.message = `User with email ${req.body.email} is already registered`;
    next();
  }
  user = new User(req.body);
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  req.statusCode = 200;
  user.password = "";
  req.data = { token, user };
  next();
});

router.post("/resetPassword/:id", validateObjectId, async (req, res, next) => {
  const userId = await User.findById(req.params.id);
  if (!userId) {
    // res.status(404).json({
    //   message: `User not found in system`,
    // });
    req.statusCode = 404;
    req.message = `User not found in system`;
    next();
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
    req.statusCode = 200;
    user.password = "";
    req.data = { token, user };
    next();
  }
});

router.post("/resetPassword/sendEmail", async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    // res.status(404).json({
    //   message: `User with ${req.body.email} not found in system`,
    // });
    req.statusCode = 404;
    req.message = `User with ${req.body.email} not found in system`;
    next();
  } else {
    sendEmailForResetPassword(
      email,
      "Reset Your password",
      "Follow the link to generate code ",
      user._id
    );
  }
  // res.json({ message: "An email with the link has been forwarded to you" });
  req.statusCode = 200;
  req.message = "An email with the link has been forwarded to you";
  next();
});

// below are extra ... ignore for now but don't delete or remove
router.delete("/userRemove/:id", admin, async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    // return res.status(404).json({ error: "User not found" });
    req.statusCode = 404;
    req.message = `User with ${req.body.email} not found in system`;
    next();
  } else {
    // res.json({ message: "User has been deleted successfully" });
    req.statusCode = 200;
    req.message = "An email with the link has been forwarded to you";
    next();
  }
});

router.get(
  "/searchUser/:id",
  validateObjectId,
  admin,
  async (req, res, next) => {
    const users = await User.find();
    const query = req.params.id.toLowerCase();
    var foundedUser = [];
    users.forEach((user) => {
      if (user.name.toLowerCase().includes(query)) {
        foundedUser.push(user);
      }
    });
    if (foundedUser.length > 0) {
      req.statusCode = 200;
      req.data = foundedUser;
      next();
    } else {
      req.statusCode = 404;
      req.message = "Could not find user";
      next();
    }
  }
);

router.put(
  "/userUpdate/:id",
  validateObjectId,
  auth,
  async (req, res, next) => {
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
  }
);

router.put("/deactivate/:id", [validateObjectId], async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    res.status(404).json({ message: `User not found` });
  } else {
    await User.findByIdAndUpdate(
      req.params.id,
      { $set: { blocked: true } },
      { new: true }
    );
    console.log(user);
    res.json({ message: user.firstName + " is blocked" });
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
 */
