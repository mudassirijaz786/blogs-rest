const Joi = require("joi");
const mongoose = require("mongoose");

// expertService schema
const expertServiceSchema = new mongoose.Schema({
  price: {
    type: String,
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// expertService model
const ExpertService = mongoose.model("ExpertService", expertServiceSchema);

validateExpertService = (expertService) => {
  const schema = {
    price: Joi.string().max(255).required(),
    service: Joi.objectId().required(),
    expert: Joi.objectId().required(),
  };
  return Joi.validate(expertService, schema);
};

exports.ExpertService = ExpertService;
exports.validate = validateExpertService;
