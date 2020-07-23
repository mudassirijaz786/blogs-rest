const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

// company schema
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  //   true => status has been set by admin
  //   false => status is false if admin does not approve

  status: {
    type: Boolean,
    required: true,
    default: false,
  },

  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },

  service_provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
});

// company model
const Company = mongoose.model("Company", companySchema);

validateCompany = (company) => {
  const schema = {
    name: Joi.string().max(50).required(),
    description: Joi.string().max(50).required(),
    service_provider_id: Joi.ObjectId.required(),
    address_id: Joi.ObjectId.required(),
  };

  return Joi.validate(company, schema);
};

exports.Company = Company;
exports.validate = validateCompany;
