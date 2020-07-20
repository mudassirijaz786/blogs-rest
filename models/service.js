const Joi = require("joi");
const mongoose = require("mongoose");

// service schema
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  //  more fields will be added soon
});

// service model
const Service = mongoose.model("Service", serviceSchema);

validateService = (service) => {
  const schema = {
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(10).max(255).required(),
  };
  return Joi.validate(service, schema);
};

exports.Service = Service;
exports.validate = validateService;
