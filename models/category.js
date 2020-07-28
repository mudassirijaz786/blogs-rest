const Joi = require("joi");
const mongoose = require("mongoose");

// category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // more fields will be added soon
});

// category model
const Category = mongoose.model("Category", categorySchema);

validateCategory = (category) => {
  const schema = {
    name: Joi.string().max(50).required(),
    imageUrl: Joi.string().required(),
  };
  return Joi.validate(category, schema);
};

exports.Category = Category;
exports.validate = validateCategory;
