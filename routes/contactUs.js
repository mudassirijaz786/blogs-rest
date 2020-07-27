const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const { ContactUs } = require("../models/contactUs");
const _ = require("lodash");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const contactUs = new ContactUs(
      _.pick(req.body, ["fullName", "message", "email"])
    );
    await contactUs.save();
    res.json({
      message: "Your message has been sent.",
      data: contactUs,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", admin, async (req, res) => {
  try {
    const contactUs = await ContactUs.find();
    if (!contactUs) {
      res.status(404).json({ notFound: "Not found" });
    } else {
      res.json({ data: contactUs });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", admin, async (req, res) => {
  try {
    const contactUs = await ContactUs.findById(req.params.id);
    if (!contactUs) {
      res.status(400).json({ notFound: "not found in system" });
    } else {
      res.json({ data: contactUs });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const contactUs = await ContactUs.findByIdAndRemove(req.params.id);
    if (!contactUs) {
      res.status(400).json({ notFound: "contactUs not found" });
    } else {
      res.json({ message: "contactUs has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/setRead/:id", admin, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
