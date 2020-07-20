const express = require("express");
const router = express.Router();

const admin = require("../middleware/admin");
const { ContactUs } = require("../models/contactUs");

const _ = require("lodash");

router.post("/", async (req, res) => {
  const contactUs = new ContactUs(_.pick(["fullNmae", "message", "email"]));
  await contactUs.save();
  res.json({ message: "Your message has been sent." });
});

router.get("/", admin, async (req, res) => {
  const contactUs = await ContactUs.find();
  res.json({ data: contactUs });
});

router.get("/:id", admin, async (req, res) => {
  const contactUs = await ContactUs.findById(req.params.id);
  if (contactUs) {
    res.json({ data: contactUs });
  } else {
    res.status(400).json({ message: "Not found" });
  }
});

router.delete("/:id", admin, async (req, res) => {
  const contactUs = await ContactUs.findByIdAndRemove(req.params.id);
  if (contactUs) {
    res.json({ message: "Deleted.." });
  } else {
    res.status(400).json({ message: "Failed. Not found!" });
  }
});

router.put("/setRead/:id", admin, async (req, res) => {
  const contactUs = await ContactUs.findByIdAndUpdate(req.params.id, {
    $set: {
      messageStatus: true,
    },
  });
  if (contactUs) {
    res.json({ message: "Message status has been set to read.." });
  } else {
    res.status(400).json({ message: "Failed. Not found!" });
  }
});

module.exports = router;
