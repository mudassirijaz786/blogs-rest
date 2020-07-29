const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  expert: {
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

  // FIXME: i think no need of services in expert profile, maybe this should be at expert service
  // type array nae hogi?
  expert_service: [
    {
      type: mongoose.Schema.Types.Array,
      ref: "ExpertService",
    },
  ],
});

const ExpertProfile = mongoose.model("ExpertProfile", schema);
exports.ExpertProfile = ExpertProfile;
