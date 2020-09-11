const router = require("express").Router();
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

const { Comment } = require("../models/comment");

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment) {
      res.json({ data: comment });
    } else {
      res.status(404).json({ message: "Comment not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Comment.find();
    if (data.length > 0) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any comment in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const comment = new Comment(
      _.pick(req.body, ["name", "comment", "created_at"])
    );
    await comment.save();
    res.json({ message: "Comment saved successfully" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error.", error });
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
          created_at: req.body.created_at,
          comment: req.body.comment,
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
    const comment = await Comment.findByIdAndRemove(req.params.id);
    if (comment) {
      res.json({ message: "comment deleted successfully." });
    } else {
      res.status(400).json({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
