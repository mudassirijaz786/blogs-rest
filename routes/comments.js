const router = require("express").Router();
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

const { Comment } = require("../models/comment");
const { Blog } = require("../models/blog");

router.get("/", async (req, res) => {
  try {
    const blog = await Blog.findById(req.body._id).populate("comments");
    res.json({ data: blog });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.findById({ _id: req.body.blog });

    const comment = new Comment();
    comment.name = req.body.name;
    comment.comment = req.body.comment;
    comment.blog = blog._id;
    await comment.save();

    blog.comments.push(comment._id);
    await blog.save();

    res.json({ message: "Comment saved successfully" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      await Comment.findByIdAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
          comment: req.body.comment,
          blog: req.body.blog,
        },
      });
      res.json({ message: "Saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const blog = await Blog.findById(req.body._id);
  await Comment.findOneAndRemove({
    _id: req.params.id,
  });
  blog.comments.pop(req.params.id);
  await blog.save();

  res.json({ message: "Comment deleted successfully" });
});

module.exports = router;
