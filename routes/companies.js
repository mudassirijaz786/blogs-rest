const router = require("express").Router();
const _ = require("lodash");

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { Company, validate } = require("../models/company");

router.get("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      res.json({ company });
    } else {
      res.status(404).json({ message: "Company not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const data = await Company.find();
    if (data) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any company in the DB" });
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
      const company = new Company(
        _.pick(req.body, [
          "name",
          "description",
          "address_id",
          "service_provider_id",
        ])
      );
      await company.save();
      res.json({ message: "Company saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.put("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: "Invalid id. Company not found" });
    } else {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      else {
        const company = req.body;
        await Company.findByIdAndUpdate(req.params.id, {
          $set: {
            company,
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
    const company = await Company.findByIdAndRemove(req.param.id);
    if (company) {
      res.json({ message: "company deleted successfully." });
    } else {
      res.status(400).json({ message: "Invalid id. Company not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
