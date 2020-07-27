const admin = require("../middleware/admin");
const _ = require("lodash");
const { TAC, validate } = require("../models/termsAndConditions");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tac = await TAC.find();
    if (!tac) {
      res.status(404).json({ notFound: "Not found" });
    } else {
      res.json({ data: tac });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tac = await TAC.findById(req.params.id);
    if (!tac) {
      res.status(400).json({ notFound: "not found in system" });
    } else {
      res.json({ data: tac });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", admin, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tac = new TAC(_.pick(req.body, ["description"]));
    await tac.save();
    res.json({
      message: "termsAndCondition has been saved successfully",
      data: tac,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", admin, async (req, res) => {
  try {
    const tac = await TAC.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({
      message: "termsAndCondition has been updated and successfully",
      data: tac,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const tac = await TAC.findByIdAndRemove(req.params.id);
    if (!tac) {
      res.status(400).json({ notFound: "termsAndCondition not found" });
    } else {
      res.json({ message: "termsAndCondition has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
