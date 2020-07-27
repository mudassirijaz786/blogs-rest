const admin = require("../middleware/admin");
const _ = require("lodash");
const { FAQs, validate } = require("../models/faqs");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const faqs = await FAQs.find();
    if (!faqs) {
      res.status(404).json({ notFound: "no faq in database" });
    } else {
      res.json({ data: faqs });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const faq = await FAQs.findById(req.params.id);
    if (faq) {
      res.json({ data: faq });
    } else {
      res.status(404).json({ notFound: "faq not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", admin, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const faqs = new FAQs(_.pick(req.body, ["question", "answer"]));
    await faqs.save();
    res.json({ message: "faqs has been saved successfully", data: faqs });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", admin, async (req, res) => {
  try {
    let found = await FAQs.findById({ _id: req.params.id });
    if (!found) {
      return res.status(404).json({
        error: "No faq in the system",
      });
    } else {
      const faqs = await FAQs.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({
        message: "faqs has been updated and successfully",
        data: faqs,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const faq = await FAQs.findByIdAndRemove(req.params.id);
    if (!faq) {
      res.status(404).json({ notFound: "No faq found" });
    } else {
      res.json({ message: "faqs has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
