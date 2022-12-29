const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const FormData = require("form-data");

// These parameters should be used for all requests
const SUMSUB_APP_TOKEN = "sbx:x870PwJmiGqjN2YOSqOzMPQs.WlZ1jw7DPFf5LzlbIUMUln9NgOglvGd3";
//sbx:x870PwJmiGqjN2YOSqOzMPQs // sbx:x870PwJmiGqjN2YOSqOzMPQs.WlZ1jw7DPFf5LzlbIUMUln9NgOglvGd3 // Example: sbx:uY0CgwELmgUAEyl4hNWxLngb.0WSeQeiYny4WEqmAALEAiK2qTC96fBad - Please don't forget to change when switching to production
const SUMSUB_SECRET_KEY = "ai5s53cHJ4V8ZLlQq36Km51Ogk46Ds4Y";
//ai5s53cHJ4V8ZLlQq36Km51Ogk46Ds4Y; // Example: Hej2ch71kG2kTd1iIUDZFNsO5C1lh5Gq - Please don't forget to change when switching to production
const SUMSUB_BASE_URL = "https://api.sumsub.com";

var config = {};
config.baseURL = SUMSUB_BASE_URL;

axios.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
});

// This function creates signature for the request as described here: https://developers.sumsub.com/api-reference/#app-tokens

function createSignature(config) {
  console.log("Creating a signature for the request...");

  var ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers["X-App-Access-Ts"] = ts;
  config.headers["X-App-Access-Sig"] = signature.digest("hex");

  return config;
}

// These functions configure requests for specified method

// https://developers.sumsub.com/api-reference/#creating-an-applicant
function createApplicant(externalUserId, levelName) {
  console.log("Creating an applicant...");

  var method = "post";
  var url = "/resources/applicants?levelName=" + levelName;
  var ts = Math.floor(Date.now() / 1000);

  var body = {
    externalUserId: externalUserId,
  };

  var headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-App-Token": SUMSUB_APP_TOKEN,
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = JSON.stringify(body);

  return config;
}

function addDocument(applicantId) {
  console.log("Adding document to the applicant...");

  var method = "post";
  var url = `/resources/applicants/${applicantId}/info/idDoc`;
  var filePath = "resources/sumsub-logo.png";

  var metadata = {
    idDocType: "PASSPORT",
    country: "GBR",
  };

  var form = new FormData();
  form.append("metadata", JSON.stringify(metadata));

  var content = fs.readFileSync(filePath);
  form.append("content", content, filePath);

  var headers = {
    Accept: "application/json",
    "X-App-Token": SUMSUB_APP_TOKEN,
  };

  config.method = method;
  config.url = url;
  config.headers = Object.assign(headers, form.getHeaders());
  config.data = form;

  return config;
}

exports.createApplicants = async (req, res, next) => {
  externalUserId = "random-JSToken-" + Math.random().toString(36).substr(2, 9);
  levelName = "testing";
  console.log("External UserID: ", externalUserId);

  response = await axios(createApplicant(externalUserId, levelName))
    .then(function (response) {
      console.log("Response:\n", response.data);
      res.status(200).json({
        status: true,
        //   message: "Create Rating Succussefully",
        response: response.data,
      });
      //   return r;
    })
    .catch(function (error) {
      console.log("Error:\n", error.response.data);
    });
};

//
module.exports.upload = async (req, res, next) => {
  var file = req.files.file;
  console.log("end  :  " + req.files);
  //   var file_name = file.file.name;
  //   console.log("end  :  " + file_name);
  //   //if you want just the buffer format you can use it
  //   var buffer = new Buffer.from(file.file.data.data);

  //   //uncomment await if you want to do stuff after the file is created

  //   /*await*/
  //   fs.writeFile(file_name, buffer, async (err) => {
  //     console.log("Successfully Written to File.");

  //     // do what you want with the file it is in (__dirname + "/" + file_name)

  //     console.log("end  :  " + new Date());

  //     console.log(result_stt + "");

  // fs.unlink(__dirname + "/" + file_name, () => {});
  res.status(200).json({
    status: true,
    message: "Create file Succussefully",
    // response: response.data,
  });
  //   });
};

// exports.addDocument = async (req, res, next) => {
//   const { applicantId } = req.body;
//   console.log("External UserID: ", applicantId);
//   try {
//     response = response = await axios(addDocument(applicantId));
//     console.log(response, "response");
//     res.status(200).json({
//       status: true,
//       message: "Create Rating Succussefully",
//       response,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
