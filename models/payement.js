const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  error: {
    type: Object,
    required: false,
  },
  status: {
    type: Boolean,
    required: true,
  },
  charge: { type: Object },
});

const Payment = mongoose.model("Payment", schema);

exports.Payment = Payment;
