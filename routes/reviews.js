const express = require("express");
const _ = require("lodash");
const { Review } = require("../models/review");
const { Appointment } = require("../models/appointment");
const { ExpertProfile } = require("../models/expertProfile");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/:id", validateObjectId, auth, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review) res.json({ review });
  else res.status(400).json({ message: "Not Found" });
});

router.get("/", auth, async (req, res) => {
  const review = await Review.find();
  if (review) {
    res.json({ data: review });
  } else {
    res.status(404).json({ message: "There is no review in the DB.." });
  }
});

router.get("/expert/:id", validateObjectId, async (req, res) => {
  const reviews = await Review.find({ expert_id: req.params.id });
  if (reviews) res.json({ reviews });
  else res.status(400).json({ message: "Not Found" });
});

router.get("/myReviews/:id", validateObjectId, auth, async (req, res) => {
  const reviews = await Review.find({ by: req.params.id });
  if (reviews) res.json({ reviews });
  else res.status(400).json({ message: "Not Found" });
});
router.post("/", validateObjectId, auth, async (req, res) => {
  const review = new Review(
    _.pick(req.body, ["description", "appointment_id", "rating"])
  );
  await review.save();
  // :TODO: population....
  // :FIXME: Ids need to be FIXED.. Bad model designing.....
  const appointment = await Appointment.findById(req.body.appointment_id);
  const expert = await ExpertProfile.find({ expert_id: appointment.expert_id });
  const rating =
    (expert.rating + parseInt(req.body.rating)) / expert.totalServicesDone + 1;
  const result = await ExpertProfile.findByIdAndUpdate(expert._id, {
    $set: { rating, totalServicesDone: totalServicesDone + 1 },
  });

  const appoint = await Appointment.findByIdAndUpdate(
    req.body.appointment_id,
    {
      $set: {
        review: true,
      },
    },
    { new: true }
  );
  res.json({ message: "Your review has been saved successfully" });
});

router.put("/:id", validateObjectId, auth, async (req, res) => {
  const review = req.body.review;
  const result = await Review.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        review,
      },
    },
    { new: true }
  );
  if (result) {
    res.json({ message: "Your review has been updated successfully." });
  } else {
    res.status(400).json({ message: "Invalid id ... Not Found." });
  }
});

router.delete("/:id", validateObjectId, auth, async (req, res) => {
  const result = await Review.findByIdAndRemove(req.params.id);
  if (result) res.json({ message: "Review has been deleted successfully" });
  else {
    res.status(400).json({ message: "Invalid id ... Not Found." });
  }
});

module.exports = router;
