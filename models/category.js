const Joi = require("joi");
const mongoose = require("mongoose");

// category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  // more fields will be added soon
});

// category model
const Category = mongoose.model("Category", categorySchema);

// :FIXME: image path need to be added...
validateCategory = (category) => {
  const schema = {
    name: Joi.string().max(50).required(),
  };
  return Joi.validate(category, schema);
};

exports.Category = Category;
exports.validate = validateCategory;
