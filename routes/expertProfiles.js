const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { ExpertProfile } = require("../models/expertProfile");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  const expertProfile = await ExpertProfile.find();
  res.json({ data: expertProfile });
});

router.get("/me/:id", auth, async (req, res) => {
  const expertProfile = await ExpertProfile.findById(req.params.id);
  res.json({ data: expertProfile });
});

router.post("/", async (req, res) => {
  const expertProfile = new ExpertProfile(
    _.pick(req.body, ["time", "expert_id", "customer_id"])
  );
  await expertProfile.save();
  res.json({ message: "ExpertProfile saved successfully" });
});

router.put("/addService", auth, async (req, res) => {
  await ExpertProfile.findOneAndUpdate(
    { expert_id: req.body.expert_id },
    {
      $push: {
        services: req.body.service_id,
      },
    },
    { new: true }
  );
  res.json({ message: "Service added to Expert Profile successfully" });
});

router.put("/deleteService", auth, async (req, res) => {
  await ExpertProfile.findOneAndUpdate(
    { expert_id: req.body.expert_id },
    { $pull: { services: req.body.service_id } }
  );
  res.json({ message: "Service has been removed successfully" });
});

router.put("/updateProfile/:id", auth, async (req, res) => {
  await ExpertProfile.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json({ message: "ExpertProfile updated successfully" });
});

router.delete("/:id", auth, async (req, res) => {
  const expertProfile = await ExpertProfile.findByIdAndRemove(req.params.id);
  res.json({ message: "expertProfile has removed..." });
});

module.exports = router;
