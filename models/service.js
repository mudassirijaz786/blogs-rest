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
  imageUrl: {
    type: String,
    required: false,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  //  more fields will be added soon
});

// service model
const Service = mongoose.model("Service", serviceSchema);

validateService = (service) => {
  const schema = {
    name: Joi.string().max(50).required(),
    description: Joi.string().max(255).required(),
    image: Joi.string().required(),
    category_id: Joi.ObjectId().required(),
  };
  return Joi.validate(service, schema);
};

exports.Service = Service;
exports.validate = validateService;
