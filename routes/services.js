const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Service, validate } = require("../models/service");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const service = await Service.find().populate("category").exec();
    !service
      ? res.status(404).json({ message: "no service in database" })
      : res.json({ data: service });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category")
      .exec();
    service
      ? res.json({ data: service })
      : res.status(404).json({ message: "service not found" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    req.body.imageUrl = req.files[0].url;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let service = new Service(
      _.pick(req.body, ["name", "description", "category", "imageUrl"])
    );

    await service.save();
    await service.populate("category").execPopulate();
    res.json({
      message: "service has been saved successfully",
      data: service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    let found = await Service.findById(req.params.id);
    if (!found) {
      return res.status(404).json({
        message: "No service in the system",
      });
    } else {
      const service1 = req.body;
      console.log(service1);
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: service1.name,
            description: service1.description,
            category: service1.category,
          },
        },
        { new: true }
      )
        .populate("category")
        .exec();
      console.log(service);
      res.json({
        message: "service has been updated successfully",
        data: service,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndRemove(req.params.id);
    !service
      ? res.status(404).json({ message: "No service found" })
      : res.json({ message: "service has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
