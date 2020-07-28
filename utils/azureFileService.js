const express = require("express");
const router = express.Router();
const multerAzure = require("multer-azure");
var azure = require("azure-storage");
const https = require("https");
const config = require("config");
const fs = require("fs");
const multer = require("multer");
var blobService = azure.createBlobService(
  "tradebaba",
  config.get("azure_api_key")
);

const storage = multerAzure({
  connectionString: config.get("azure_connection_string"), //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
  account: "tradebaba", //The name of the Azure storage account
  key: config.get("azure_api_key"), //A key listed under Access keys in the storage account pane
  container: "unnic", //Any container name, it will be created if it doesn't exist
  blobPathResolver: function (req, file, callback) {
    var blobPath = file.fieldname + "-" + Date.now() + "-" + file.originalname;

    callback(null, blobPath);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  // fileFilter: fileFilter,
});
exports.upload = upload;
