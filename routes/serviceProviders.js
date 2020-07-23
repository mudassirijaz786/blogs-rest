const router = require("express").Router();
const _ = require("lodash");

const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

const { ServiceProvider, validate } = require("../models/serviceProvider");

router.get("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (serviceProvider) {
      res.json({ serviceProvider });
    } else {
      res.status(404).json({ message: "Service Provider  not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const data = await ServiceProvider.find();
    if (data) {
      res.json({ data });
    } else {
      res
        .status(404)
        .json({ message: "There is not any service Provider in the DB" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
// :TODO: login route if needed...

router.post("/login", async (req, res) => {});

// :FIXME: Validing the request to find if the Service Provider exists with the same email...
router.post("/register", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const serviceProvider = new ServiceProvider(
        _.pick(req.body, [
          "firstName",
          "lastName",
          "gender",
          "address_id",
          "email",
          "password",
          "mobileNumber",
        ])
      );
      await serviceProvider.save();
      res.json({ message: "Service Provider  saved successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});
router.put("/:id", validateObjectId, auth, async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (!serviceProvider) {
      res
        .status(404)
        .json({ message: "Invalid id. ServiceProvider  not found" });
    } else {
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      else {
        const serviceProvider = req.body;
        await ServiceProvider.findByIdAndUpdate(req.params.id, {
          $set: {
            serviceProvider,
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
    const serviceProvider = await ServiceProvider.findByIdAndRemove(
      req.param.id
    );
    if (serviceProvider) {
      res.json({ message: "Service Provider  deleted successfully." });
    } else {
      res
        .status(400)
        .json({ message: "Invalid id. Service Provider not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
