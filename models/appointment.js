const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  expert_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Appointment = mongoose.model("Appointment", schema);
exports.Appointment = Appointment;
