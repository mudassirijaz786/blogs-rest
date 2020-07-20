const admin = require("../middleware/admin");
const _ = require("lodash");
const { Service, validate } = require("../models/service");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const service = await Service.find();
    if (!service) {
      res.status(404).json({ notFound: "no service in database" });
    } else {
      res.json({ data: service });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json({ data: service });
    } else {
      res.status(404).json({ notFound: "service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", admin, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const service = new Service(_.pick(req.body, ["name", "description"]));
    await service.save();
    res.json({ message: "service has been saved successfully", data: service });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", admin, async (req, res) => {
  try {
    let found = await Service.findById({ _id: req.params.id });
    if (!found) {
      return res.status(404).json({
        error: "No service in the system",
      });
    } else {
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.json({
        message: "service has been updated successfully",
        data: service,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const service = await Service.findByIdAndRemove(req.params.id);
    if (!service) {
      res.status(404).json({ notFound: "No service found" });
    } else {
      res.json({ message: "service has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
