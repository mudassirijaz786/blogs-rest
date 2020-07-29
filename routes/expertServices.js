const router = require("express").Router();
const _ = require("lodash");

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { ExpertService, validate } = require("../models/expertService.js");

router.get("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const expertService = await ExpertService.findById(req.params.id)
      .populate("service expert")
      .exec();
    if (expertService) {
      res.json({ expertService });
    } else {
      res.status(404).json({ message: "expert Service not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/myServices/:id", validateObjectId, auth, async (req, res) => {
  try {
    const expertService = await ExpertService.find({ expert: req.params.id })
      .populate("service")
      .exec();
    if (expertService) {
      res.json({ expertService });
    } else {
      res.status(404).json({ message: "expert Service not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/search/:query", auth, async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();

    const expertService = await ExpertService.find()
      .populate("service expert")
      .exec();
    var experts = [];
    expertService.forEach((obj) => {
      const service = obj.service;
      if (
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      )
        experts.push(obj);
    });

    if (experts.length > 0) {
      res.json({ data: experts });
    } else {
      res.status(400).json({
        message: "Could not found any service regarding your search ...",
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error.", error });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const expertService = await ExpertService.find()
      .populate("service expert")
      .exec();
    if (expertService) {
      res.json({ data: expertService });
    } else {
      res
        .status(404)
        .json({ message: "There is not any ExpertService in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const expertService = new ExpertService(
        _.pick(req.body, ["expert", "service", "price"])
      );
      await expertService.save();
      await expertService.populate("service expert").execPopulate();
      res.json({
        message: "Expert Service saved successfully",
        data: expertService,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

// FIXME: put is not working properly
router.put("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const expertService = await ExpertService.findById(req.params.id);
    if (!expertService) {
      res.status(404).json({ message: "Invalid id. expert Service not found" });
    } else {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      else {
        const expertServic = req.body;
        await ExpertService.findByIdAndUpdate(req.params.id, {
          $set: {
            expertServic,
          },
        });
        res.json({ message: "Saved successfully" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.delete("/:id", validateObjectId, auth, async (req, res) => {
  try {
    console.log(req.param.id);
    const expertService = await ExpertService.findByIdAndRemove(req.params.id);
    if (expertService) {
      res.json({ message: "expert Service deleted successfully." });
    } else {
      res.status(400).json({ message: "Invalid id. expert Service not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
