const mongoose = require("mongoose");
// is ko abi ignore kr dena ha ...
const schema = new mongoose.Schema({
  expert_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  services: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
});

const ExpertProfile = mongoose.model("ExpertProfile", schema);
exports.ExpertProfile = ExpertProfile;
