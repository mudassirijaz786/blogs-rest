const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  to: {
    type: String,
    required: false,
  },
  from: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: "UNREAD",
  },
  description: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    default: new Date(),
  },
  image_From: {
    type: String,
    required: false,
  },
  image_Item: {
    type: String,
    required: false,
  },
});

schema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

exports.Notification = new mongoose.model("Notification", schema);
