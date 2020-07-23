const router = require("express").Router();
const _ = require("lodash");

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { Address, validate } = require("../models/address");

router.get("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (address) {
      res.json({ address });
    } else {
      res.status(404).json({ message: "Address not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const data = await Address.find();
    if (data) {
      res.json({ data });
    } else {
      res.status(404).json({ message: "There is not any address in the DB" });
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
      const address = new Address(
        _.pick(req.body, ["city", "state", "country"])
      );
      await address.save();
      res.json({ message: "Address saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.put("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      res.status(404).json({ message: "Invalid id. Address not found" });
    } else {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      else {
        const address = req.body;
        await Address.findByIdAndUpdate(req.params.id, {
          $set: {
            address,
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
    const address = await Address.findByIdAndRemove(req.param.id);
    if (address) {
      res.json({ message: "address deleted successfully." });
    } else {
      res.status(400).json({ message: "Invalid id. Address not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;

// const router = require("express").Router();
// const auth = require("../middleware/auth");

// const { Address } = require("../models/address");

// router.get("/:id", auth, async (req, res) => {});
// router.get("/", auth, async (req, res) => {});
// router.post("/", auth, async (req, res) => {});
// router.put("/:id", auth, async (req, res) => {});
// router.delete("/:id", auth, async(req, res));

// module.exports = router;
