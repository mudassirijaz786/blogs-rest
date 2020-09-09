const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

});

const Category = mongoose.model("Category", categorySchema);

validateCategory = (category) => {
  const schema = {
    name: Joi.string().max(50).required(),
  };
  return Joi.validate(category, schema);
};

exports.Category = Category;
exports.validate = validateCategory;
