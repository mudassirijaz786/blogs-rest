const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { Expert } = require("../models/expert");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  const experts = await Expert.find();
  res.json({ data: experts });
});
router.get("/me/:id", auth, async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  res.json({ data: expert });
});
router.post("/", async (req, res) => {
  const expert = new Expert(
    _.pick(req.body, ["time", "expert_id", "customer_id"])
  );
  await expert.save();
  res.json({ message: "Expert saved successfully" });
});
router.put("/:id", auth, async (req, res) => {
  const expert = await Expert.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json({ message: "expert updated successfully" });
});
router.delete("/:id", auth, async (req, res) => {
  const expert = await Expert.findByIdAndRemove(req.params.id);
  res.json({ message: "Expert has removed..." });
});
