const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
// const image = require("../middleware/saveImage");
const _ = require("lodash");
const { Service, validate } = require("../models/service");
const { upload } = require("../utils/azureFileService");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const service = await Service.find().populate("category").exec();
    if (!service) {
      res.status(404).json({ message: "no service in database" });
    } else {
      res.json({ data: service });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category")
      .exec();
    if (service) {
      res.json({ data: service });
    } else {
      res.status(404).json({ message: "service not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/search/:query", async (req, res) => {
  const query = req.params.query.toLowerCase();
  const services = await Service.find().populate("category").exec();
  var foundServices = [];
  services.forEach((service) => {
    if (
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
    ) {
      foundServices.push(service);
    }
  });
  if (foundServices.length > 0) {
    res.json({ data: foundServices });
  } else {
    res.status(400).json({
      message: "Could not found any service regarding your search ...",
    });
  }
});

router.get("/byName/:name", async (req, res) => {
  try {
    const services = await Service.find({ name: req.params.name })
      .populate("category")
      .exec();
    if (!services) {
      res.status(400).json({ message: "No Service found!" });
    } else {
      res.json({ data: services });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error.." });
  }
});

router.post("/", upload.any(), async (req, res) => {
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

router.put("/updateImage/:id", upload.any(), async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, {
    $set: { imageUrl: req.files[0].url },
  });
  service
    ? res.json({ message: "Image updated successfully" })
    : res
        .status(404)
        .json({ message: "Could not found any Service. Invalid id.." });
});

router.put("/:id", [validateObjectId, admin], async (req, res) => {
  try {
    let found = await Service.findById({ _id: req.params.id });
    if (!found) {
      return res.status(404).json({
        message: "No service in the system",
      });
    } else {
      const service1 = req.body;
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
      res.json({
        message: "service has been updated successfully",
        data: service,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.delete("/:id", admin, async (req, res) => {
  try {
    const service = await Service.findByIdAndRemove(req.params.id);
    if (!service) {
      res.status(404).json({ message: "No service found" });
    } else {
      res.json({ message: "service has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
