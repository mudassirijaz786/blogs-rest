const router = require("express").Router();
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

const { Author } = require("../models/author");

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate("books");

    if (author) {
      res.json({ data: author });
    } else {
      res.status(404).json({ message: "Author not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Author.find().populate("books");
    if (data.length > 0) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any author in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      res.status(404).json({ message: "Author not found" });
    } else {
      await Author.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        {
          new: true,
        }
      );

      res.json({ message: "Saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const author = await Author.findByIdAndRemove(req.params.id);
    if (author) {
      res.json({ message: "author deleted successfully." });
    } else {
      res.status(400).json({ message: "Author not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
