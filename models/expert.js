const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  totalServicesDone: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  rating: {
    type: String,
    required: true,
    default: "5.0",
  },
  experties: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Expert = mongoose.model("Expert", schema);
exports.Expert = Expert;
