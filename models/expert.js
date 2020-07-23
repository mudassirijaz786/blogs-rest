const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Expert = mongoose.model("Expert", schema);

validateExpert = (address) => {
  const schema = {
    name: Joi.string().max(50).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().alphanum().min(8).max(32).required(),
  };

  return Joi.validate(address, schema);
};

exports.Expert = Expert;
exports.validate = validateExpert;
