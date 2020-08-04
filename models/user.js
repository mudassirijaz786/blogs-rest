const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  gender: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ["service_provider", "service_seeker"],
    required: true,
  },
  blocked: {
    type: Boolean,
    // required: true,
    default: false,
  },
  experties: {
    type: String,
    required: true,
    default: "Wheel Balancing",
  },
  imageUrl: {
    type: String,
    // required: true,
    default: "",
  },
  heading: {
    type: String,
    // required: true,
    default: "this is service provider headline",
  },
  rating: {
    type: String,
    required: true,
    default: "5.0",
  },
  description: {
    type: String,
    // required: true,
    default: "this is service provider description",
  },
});

// token generation
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: 86400 }
  );
  return token;
};

// User model
const User = mongoose.model("User", userSchema);

validateUser = (user) => {
  const phoneReg = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    gender: Joi.string().min(2).max(50).required(),
    role: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().alphanum().min(8).max(32).required(),
    mobileNumber: Joi.string()
      .regex(RegExp(phoneReg))
      .required()
      .options({
        language: {
          string: {
            regex: {
              base: "must be a valid phone number",
            },
          },
        },
      }),
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;
