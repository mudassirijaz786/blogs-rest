const router = require("express").Router();
const _ = require("lodash");

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { CompanyService, validate } = require("../models/companyService");

router.get("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const companyService = await CompanyService.findById(req.params.id);
    if (companyService) {
      res.json({ companyService });
    } else {
      res.status(404).json({ message: "Company Service not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const data = await CompanyService.find();
    if (data) {
      res.json({ data });
    } else {
      res
        .status(404)
        .json({ message: "There is not any companyService in the DB" });
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
      const companyService = new CompanyService(
        _.pick(req.body, ["company_id", "category_id", "price"])
      );
      await companyService.save();
      res.json({ message: "Company Service saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.put("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const companyService = await CompanyService.findById(req.params.id);
    if (!companyService) {
      res
        .status(404)
        .json({ message: "Invalid id. Company Service not found" });
    } else {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      else {
        const companyService = req.body;
        await CompanyService.findByIdAndUpdate(req.params.id, {
          $set: {
            companyService,
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
    const companyService = await CompanyService.findByIdAndRemove(req.param.id);
    if (companyService) {
      res.json({ message: "company Service deleted successfully." });
    } else {
      res
        .status(400)
        .json({ message: "Invalid id. Company Service not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
