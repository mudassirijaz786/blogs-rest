const mongoose = require("mongoose");
const joi = require("joi");

const reviews = new mongoose.Schema({
  appointment_id: {
    type: Sting,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  updated_at: { type: String },
});
reviews.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Review = mongoose.model("Review", reviews);

exports.Review = Review;
