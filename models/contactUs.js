const mongoose = require("mongoose");

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

exports.ContactUs = ContactUs;
// (full name, email, message)
