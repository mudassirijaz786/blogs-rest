// :TODO:
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  charge: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
});

const Invoice = mongoose.model("Invoice", schema);
exports.Invoice = Invoice;
