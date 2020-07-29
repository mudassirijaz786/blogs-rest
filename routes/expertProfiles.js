const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { ExpertProfile } = require("../models/expertProfile");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  try {
    const expertProfiles = await ExpertProfile.find()
      .populate("expert_service")
      .exec();
    if (!expertProfiles) {
      res.status(404).json({ message: "No expert profile found" });
    } else {
      res.json({ data: expertProfiles });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const expertProfile = await ExpertProfile.findById(req.params.id)
      .populate("expert_service")
      .exec();
    if (!expertProfile) {
      res.status(404).json({ message: "Expert profile not found" });
    } else {
      res.json({ data: expertProfile });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const expertProfile = new ExpertProfile(
      _.pick(req.body, ["detail", "expert"])
    );
    await expertProfile.save();
    await expertProfile.populate("expert_service").execPopulate();
    res.json({
      message: "Expert profile saved successfully",
      data: expertProfile,
    });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

// router.put("/addService", auth, async (req, res) => {
//   try {
//     await ExpertProfile.findOneAndUpdate(
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
//   await ExpertProfile.findOneAndUpdate(
//     { expert_id: req.body.expert_id },
//     { $pull: { services: req.body.service_id } }
//   );
//   res.json({ message: "Service has been removed successfully" });
// });

router.put("/updateProfile/:id", auth, async (req, res) => {
  await ExpertProfile.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json({ message: "ExpertProfile updated successfully" });
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const found = await ExpertProfile.findByIdAndRemove(req.params.id);
    if (!found) {
      res.status(404).json({ message: "expert profile not found" });
    } else {
      res.json({ message: "expert Profile has removed..." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
