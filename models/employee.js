const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

// employee schema
const employeeSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  experties: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  experience: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  bio: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  blocked: {
    type: Boolean,
    // required: true,
    default: false,
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
});

// employee model
const Employee = mongoose.model("Employee", employeeSchema);

validateEmployee = (employee) => {
  const phoneReg = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    experience: Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(50).required(),
    expert_profile: Joi.objectId().required(),
    country: Joi.string().min(2).max(50).required(),
    bio: Joi.string().min(2).max(50).required(),
    experties: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string()
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

  return Joi.validate(employee, schema);
};

exports.Employee = Employee;
exports.validate = validateEmployee;
