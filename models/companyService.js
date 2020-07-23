const Joi = require("joi");
const mongoose = require("mongoose");

// companyService schema
const companySchema = new mongoose.Schema({
  price: {
    type: String,
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  //  more fields will be added soon
});

// companyService model
const CompanyService = mongoose.model("CompanyService", companySchema);

validateCompanyService = (companyService) => {
  const schema = {
    price: Joi.string().max(255).required(),
    category_id: Joi.ObjectId().required(),
    company_id: Joi.ObjectId().required(),
  };
  return Joi.validate(companyService, schema);
};

exports.CompanyService = CompanyService;
exports.validate = validateCompanyService;
