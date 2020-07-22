const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const { Appointment } = require("../models/appointment");

router.get("/", auth, async (req, res) => {
  const appointments = await Appointment.find();
  res.json({ data: appointments });
});

router.get("/me/:id", auth, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  res.json({ data: appointment });
});

router.post("/", async (req, res) => {
  const appointment = new Appointment(
    _.pick(req.body, ["time", "expert_id", "customer_id"])
  );
  await appointment.save();
  res.json({ message: "Appointment saved successfully" });
});

router.put("/:id", auth, async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json({ message: "Appointment updated successfully" });
});

router.delete("/:id", auth, async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove(req.params.id);
  res.json({ message: "Appointment has removed..." });
});
