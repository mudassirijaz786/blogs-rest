const router = require("express").Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { Category, validate } = require("../models/category");

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json({ data: category });
    } else {
      res.status(404).json({ message: "Category not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Category.find();
    if (data.length > 0) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any category in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const category = new Category(_.pick(req.body, ["name", "imageUrl"]));
      await category.save();
      res.json({ message: "Category saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error.", error });
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Invalid id. Category not found" });
    } else {
      await Category.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
        },
      });
      res.json({ message: "Saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (category) {
      res.json({ message: "category deleted successfully." });
    } else {
      res.status(400).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
