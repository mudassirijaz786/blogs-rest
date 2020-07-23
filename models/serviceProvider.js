const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

// serviceProvider schema
const serviceProviderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
});

// token generation for service provider
serviceProviderSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      isServiceProvider: true,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

// serviceProvider model
const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

validateServiceProvider = (serviceProvider) => {
  const phoneReg = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  const schema = {
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    address_id: Joi.ObjectId().required(),
    gender: Joi.string().required(),
    email: Joi.string().max(255).required().email(),
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
  return Joi.validate(serviceProvider, schema);
};

exports.ServiceProvider = ServiceProvider;
exports.validate = validateServiceProvider;
