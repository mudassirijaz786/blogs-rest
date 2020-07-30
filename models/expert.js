const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalServicesDone: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: String,
    required: true,
    default: "5.0",
  },
  detail: {
    type: String,
    required: true,
  },
});

const Expert = mongoose.model("Expert", schema);
exports.Expert = Expert;
