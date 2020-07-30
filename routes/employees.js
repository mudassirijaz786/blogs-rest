const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const bcrypt = require("bcryptjs");
const admin = require("../middleware/admin");
const { upload } = require("../utils/azureFileService");
const _ = require("lodash");
const express = require("express");
const { Employee, validate } = require("../models/employee");
const router = express.Router();
const Joi = require("joi");

// :FIXME: password need not to be shown,,,,,,deep population.... FIXED.....

router.get("/me/:id", validateObjectId, auth, async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate({
      path: "expert_profile",
      model: "ExpertProfile",
      populate: {
        path: "expert",
        model: "User",
        select: "firstName email lastName",
      },
    })
    .exec();
  // console.log(employee.expertProfile);
  //
  // "expert": {
  //   "
  employee
    ? res.json({ employee })
    : res
        .status(404)
        .json({ message: "Could not find employee with given id" });
});
router.get("/", auth, async (req, res) => {
  const data = await Employee.find()
    .populate({
      path: "expert_profile",
      model: "ExpertProfile",
      populate: {
        path: "expert",
        model: "User",
        select: "firstName email lastName",
      },
    })
    .exec();
  data.length > 0
    ? res.json({ data })
    : res
        .status(404)
        .json({ message: "could not find any employee in the DB" });
});
router.post("/", upload.any(), auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let employee = await Employee.findOne({ email: req.body.email });
    if (employee)
      return res.status(401).json({
        error: `Employee with email ${req.body.email} is already registered`,
      });
    employee = new Employee(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "phoneNumber",
        "experties",
        "experience",
        "city",
        "email",
        "country",
        "bio",
        "expert_profile",
      ])
    );
    employee.imageUrl = req.files[0].url;
    await employee.save();
    res.json({ message: "Employee has been added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndRemove(req.params.id);
    !employee
      ? res.status(404).json({ error: "Employee not found" })
      : res.json({ message: "Employee has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/searchEmployee/:query", async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate({
        path: "expert_profile",
        model: "ExpertProfile",
        populate: {
          path: "expert",
          model: "User",
          select: "firstName email lastName",
        },
      })
      .exec();
    const query = req.params.query.toLowerCase();
    var foundedEmployee = [];
    employees.forEach((employee) => {
      if (
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.bio.toLowerCase().includes(query)
      ) {
        foundedEmployee.push(employee);
      }
    });
    res.json({ data: foundedEmployee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", error });
  }
});

router.put(
  "/updateImage/:id",
  validateObjectId,
  auth,
  upload.any(),
  async (req, res) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, {
      $set: { imageUrl: req.files[0].url },
    });
    employee
      ? res.json({ message: "Image updated successfully" })
      : res.status(404).json({ message: "Employee not found" });
  }
);

router.put("/update/:id", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const found = await Employee.findById(req.params.id);
    if (!found) {
      res.status(404).json({ message: "Invalid id. employee not found" });
    } else {
      const e = req.body;
      const employees = await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: e },
        { new: true }
      );
      res.json({
        message: "employee has been updateed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/changeStatus/:id", async (req, res) => {
  try {
    const employee = await Employee.findById({ _id: req.params.id });
    if (!employee) {
      res.status(404).json({ message: `Employee not found` });
    } else {
      const status = !employee.blocked;
      await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: { blocked: status } },
        { new: true }
      );
      const message =
        employee.firstName + " is " + employee.blocked
          ? "Unblocked."
          : "Blocked.";
      res.json({
        message,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// function to validate login params
validateLogin = (req) => {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().alphanum().min(8).max(32).required(),
  };

  return Joi.validate(req, schema);
};

module.exports = router;
