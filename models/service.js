const Joi = require("joi");
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

validateService = (service) => {
  const schema = {
    name: Joi.string().max(50).required(),
    description: Joi.string().max(255).required(),
    category: Joi.objectId().required(),
  };
  return Joi.validate(service, schema);
};

exports.Service = Service;
exports.validate = validateService;
