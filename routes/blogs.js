const router = require("express").Router();
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

const { Blog } = require("../models/blog");

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json({ data: blog });
    } else {
      res.status(404).json({ message: "Blog not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Blog.find();
    if (data.length > 0) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any blog in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const blog = new Blog(_.pick(req.body, ["title", "text"]));
    await blog.save();
    res.json({ message: "Blog saved successfully" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error.", error });
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
    } else {
      await Blog.findByIdAndUpdate(req.params.id, {
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
    const blog = await Blog.findByIdAndRemove(req.params.id);
    if (blog) {
      res.json({ message: "blog deleted successfully." });
    } else {
      res.status(400).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
