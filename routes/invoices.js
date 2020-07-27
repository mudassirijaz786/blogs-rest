const express = require("express");
const router = express.Router();
const { Invoice } = require("../models/invoice");
const auth = require("../middleware/auth");

const validateObjectId = require("../middleware/validateObjectId");
router.get("/me/:id", validateObjectId, auth, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  invoice
    ? res.json(invoice)
    : res.status(404).json({ message: "Invoice not found..." });
});

router.get("/", auth, async (req, res) => {
  const invoices = await Invoice.find();
  invoices.length > 0
    ? res.json({ data: invoices })
    : res.status(404).json({ message: "Could not found any invoice." });
});

router.get("/myInvoices/:email", auth, async (req, res) => {
  const invoices = await Invoice.find({ email: req.params.email });
  invoices.length > 0
    ? res.json({ data: invoices })
    : res.status(404).json({ message: "Could not found any invoice." });
});

router.get("/totalEarned", auth, async (req, res) => {
  // const
  // :FIXME: :TODO: Need to be tested and implemented accurately...
});

router.get("/todayEarned", auth, async (req, res) => {
  // const
  // :FIXME: :TODO: Need to be tested and implemented accurately...
});

router.delete("/:id", validateObjectId, auth, async (req, res) => {
  const invoice = await Invoice.findByIdAndRemove(req.params.id);
  invoice
    ? res.json({ message: "deleted successfully" })
    : res.status(404).json({ message: "Could not delete the Invoice.." });
});
