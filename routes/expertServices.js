const router = require("express").Router();
const _ = require("lodash");

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { ExpertService, validate } = require("../models/expertService.js");

router.get("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const expertService = await ExpertService.findById(req.params.id)
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

router.get("/", auth, async (req, res) => {
  try {
    const expertService = await ExpertService.find().populate("service").exec();
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
      await expertService.populate("service").execPopulate();
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
        const expertService = req.body;
        await ExpertService.findByIdAndUpdate(req.params.id, {
          $set: {
            expertService,
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
