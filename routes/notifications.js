// const express = require('express')
const router = require("express").Router();
const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const _ = require("lodash");

router.get("/:id", async (req, res) => {
  const rslt = await Notification.findById(req.params.id);
  res.send(rslt);
});
router.get("/myNotifications/:id", validateObjectId, auth, async (req, res) => {
  const result = await Notification.find({ to: req.params.id });
  res.send(result);
});
router.get("/", auth, async (req, res) => {
  const result = await Notification.find();
  res.send(result);
});
router.get("/admin/notifs", auth, async (req, res) => {
  const n = await Notification.find({ to: "ADMIN" });
  res.send(n);
});
router.post("/", auth, async (req, res) => {
  const notification = new Notification(
    _.pick(req.body, [
      "to",
      "from",
      "status",
      "description",
      "time",
      "image_From",
      "image_Item",
    ])
  );
  const not = await notification.save();
  res.send(not);
});

router.put("/markAsRead", auth, async (req, res) => {
  const rslt = await Notification.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        status: "READ",
      },
    },
    { new: true }
  );
  res.send(rslt);
});

router.delete("/:id", auth, async (req, res) => {
  const rslt = await Notification.findByIdAndRemove(req.params.id);
  res.send(rslt);
});

module.exports = router;
