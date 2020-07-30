const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { Expert } = require("../models/expert");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  try {
    const expertProfiles = await Expert.find()
      .populate({
        path: "expert_service",
        model: "ExpertService",
      })
      .exec();
    if (!expertProfiles) {
      res.status(404).json({ message: "No expert  found" });
    } else {
      res.json({ data: expertProfiles });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id)
      .populate("expert_service")
      .exec();
    if (!expert) {
      res.status(404).json({ message: "Expert  not found" });
    } else {
      res.json({ data: expert });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const expert = new Expert(_.pick(req.body, ["detail", "expert"]));
    await expert.save();
    await expert.populate("expert_service").execPopulate();
    res.json({
      message: "Expert  saved successfully",
      data: expert,
    });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

// router.put("/addService", auth, async (req, res) => {
//   try {
//     await Expert.findOneAndUpdate(
//       { expert: req.body.expert },
//       {
//         $push: {
//           services: req.body.service,
//         },
//       },
//       { new: true }
//     );
//     res.json({ message: "Service added to Expert Profile successfully" });
//   } catch (error) {
//     res.status(400).json({ message: "Internal Server Error." });
//   }
// });

// router.put("/deleteService", auth, async (req, res) => {
//   await Expert.findOneAndUpdate(
//     { expert_id: req.body.expert_id },
//     { $pull: { services: req.body.service_id } }
//   );
//   res.json({ message: "Service has been removed successfully" });
// });

router.put("/updateProfile/:id", auth, async (req, res) => {
  await Expert.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json({ message: "Expert updated successfully" });
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const found = await Expert.findByIdAndRemove(req.params.id);
    if (!found) {
      res.status(404).json({ message: "expert  not found" });
    } else {
      res.json({ message: "expert Profile has removed..." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
