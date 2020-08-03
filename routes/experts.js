const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const serviceProvider = require("../middleware/serviceProvider");
const { upload } = require("../utils/azureFileService");

const auth = require("../middleware/auth");
const { Expert } = require("../models/expert");
const _ = require("lodash");

router.get("/", auth, async (req, res) => {
  try {
    const expertProfiles = await Expert.find()
      .populate({
        path: "provider",
        model: "User",
        select: "-password",
      })
      .exec();
    !expertProfiles
      ? res.status(404).json({ message: "No expert  found" })
      : res.json({ data: expertProfiles });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id)
      .populate({
        path: "provider",
        model: "User",
        select: "-password",
      })
      .exec();
    !expert
      ? res.status(404).json({ message: "Expert  not found" })
      : res.json({ data: expert });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", upload.any(), async (req, res) => {
  try {
    req.body.imageUrl = req.files[0].url;
    const expert = new Expert(
      _.pick(req.body, [
        "detail",
        "address",
        "name",
        "provider",
        "experties",
        "imageUrl",
      ])
    );
    await expert.save();
    await expert
      .populate({
        path: "provider",
        model: "User",
        select: "-password",
      })
      .execPopulate();
    res.json({
      message: "Expert saved successfully",
      data: expert,
    });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.put("/:id", [validateObjectId], async (req, res) => {
  const found = await Expert.findById(req.params.id);
  !found
    ? res.status(404).json({ message: "not found" })
    : await Expert.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
  res.json({ message: "Expert updated successfully" });
});

router.delete("/:id", [validateObjectId], async (req, res) => {
  try {
    const found = await Expert.findByIdAndRemove(req.params.id);
    !found
      ? res.status(404).json({ message: "expert  not found" })
      : res.json({ message: "expert Profile has removed" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
