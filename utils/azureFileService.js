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
// const upload = multer({ storage: storage });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  // fileFilter: fileFilter,
});
router.post("/", upload.any(), (req, res, next) => {
  res.send(req.files[0].blobPath);
});

router.get("/:id", (req, res) => {
  try {
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 1000);
    startDate.setMinutes(startDate.getMinutes() - 1000);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate,
      },
    };
    const blobName = req.params.id;

    var token = blobService.generateSharedAccessSignature(
      "unnic",
      blobName,
      sharedAccessPolicy
    );
    var sasUrl = blobService.getUrl("unnic", blobName, token);

    res.json({ url: sasUrl });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
