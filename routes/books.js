const router = require("express").Router();
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

const { Book } = require("../models/book");
const { Author } = require("../models/author");

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("authors");
    if (book) {
      res.json({ data: book });
    } else {
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Book.find().populate("authors");
    if (data.length > 0) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any book in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = new Book(_.pick(req.body, ["title"]));
    await book.save();
    res.json({ message: "Book saved successfully" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error.", error });
  }
});

router.post("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  const author = new Author();
  author.name = req.body.name;
  await author.save();

  console.log(author);
  console.log(book);
  book.authors.push(author._id);
  await book.save();

  res.json({ message: "Author saved successfully" });
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    } else {
      await Book.findByIdAndUpdate(req.params.id, {
        $set: {
          title: req.body.title,
          text: req.body.text,
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
    const book = await Book.findByIdAndRemove(req.params.id);
    if (book) {
      res.json({ message: "book deleted successfully." });
    } else {
      res.status(400).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
