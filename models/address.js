const Joi = require("joi");
const mongoose = require("mongoose");

// address schema
const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

// address model
const Address = mongoose.model("Address", addressSchema);

validateAddress = (address) => {
  const schema = {
    city: Joi.string().max(50).required(),
    state: Joi.string().max(255).required(),
    country: Joi.string().max(255).required(),
  };

  return Joi.validate(address, schema);
};

exports.Address = Address;
exports.validate = validateAddress;
