const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const AWS = require("aws-sdk");
const Busboy = require("busboy");
const config = require("config");

const aws = config.get("aws");
// const IAM_USER_KEY = "AKIAJRP33KBZB2GN4POA";
// const IAM_USER_SECRET = "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";

urlofvideo = "";

// console.log("global variable urlofvideo", urlofvideo);

let s3bucket = new AWS.S3({ aws });
download = (req, res) => {
  const s3Client = s3bucket.s3Client;
  const params = {
    Bucket: aws.Bucket,
    key: req.params.filename,
  };

  params.Key = req.params.filename;

  s3Client
    .getObject(params)
    .createReadStream()
    .on("error", function (err) {
      res.status(500).json({ error: "Error -> " + err });
    })
    .pipe(res);
};

router.get("/:filename", download);

function uploadToS3(file) {
  s3bucket.createBucket(function () {
    var params = {
      Bucket: aws.Bucket,
      Key: file.name["name"],
      Body: file.name["data"],
    };
    console.log("params", params);
    s3bucket.upload(params, function (err, data) {
      if (err) {
        console.log("error in callback");
        console.log(err);
      } else {
        console.log("successfully uploaded aws s3");
        console.log(data.Location);
        urlofvideo = data.Location;
        return data.Location;
      }
    });
  });
}

// The following is an example of making file upload with additional body
// parameters.
// To make a call with PostMan
// Don't put any headers (content-type)
// Under body:
// check form-data
// Put the body with "element1": "test", "element2": image file

router.post("/upload", verifyToken, async (req, res) => {
  // This grabs the additional parameters so in this case passing in
  // "element1" with a value.
  // const element1 = req.body.element1;
  // let name = await Video.findOne({ name: req.files.path });
  // console.log(name);
  var busboy = new Busboy({ headers: req.headers });

  // The file upload has completed
  busboy.on("finish", async function () {
    console.log("Upload finished");

    // Your files are stored in req.files. In this case,
    // you only have one and it's req.files.element2:
    // This returns:
    // {
    //    element2: {
    //      data: ...contents of the file...,
    //      name: 'Example.jpg',
    //      encoding: '7bit',
    //      mimetype: 'image/png',
    //      truncated: false,
    //      size: 959480
    //    }
    // }

    // Grabs your file object from the request.

    // Begins the upload to the AWS S3

    const location = uploadToS3(req.files);
    res.json(location);
    // var options = {
    //   provider: "google",

    //   // Optional depending on the providers
    //   httpAdapter: "https", // Default
    //   apiKey: "AIzaSyBa7nrYn-0UwtGm5QRloCl4ncm0RQDjabw", // for Mapquest, OpenCage, Google Premier
    //   formatter: null, // 'gpx', 'string', ...
    // };
  });
  // res.status(200).json({ compaign: newVideo });
  req.pipe(busboy);
});

module.exports = router;
