const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },

  //   true => message has been read by admin
  //   false => message has unread status

  messageStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const ContactUs = mongoose.model("ContactUs", schema);

validateContactUs = (contactUs) => {
  const schema = {
    fullName: Joi.string().max(255).required(),
    email: Joi.string().required().email(),
    message: Joi.string().required(),
  };
  return Joi.validate(contactUs, schema);
};

exports.ContactUs = ContactUs;
exports.validate = validateContactUs;

// (full name, email, message)
