const path = require("path");
const axios = require("axios");
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });
const Email = require(path.join(__dirname, "..", "utils", "Email"));
// this function only sends otp to mailtrap for email and password otp verification, but can be configured for mobile as well
const generateOtp = async function (mode, user) {
  const otp = Math.floor(1000 + Math.random() * 1000);
  const date = Date.now() + 10 * 60 * 1000;
  user[`verificationToken`][`${mode}Token`] = otp;
  user[`verificationToken`][`${mode}TokenExpiry`] = date;
  await user.save();
  // SENDING OTP TO USER PART
  if (mode === "email") {
    try {
      await new Email(user, otp).send();
    } catch (error) {
      console.log("EMAIL ERROR", error);
    }
  }
  if (mode === "mobile") {
    const mobileNumber = user.mobile.mobileNumber;
    try {
      // console.log(otp);
      // console.log(mobileNumber);
      // massage body encoded by exact DLT register Body
      let masg = `${otp}%20is%20your%20Aaoo%20Chale%20Login%20OTP.%0APlease%20do%20not%20share%20it%20with%20anyone.%0A%0ATeam%0AAaoo%20Chale`;
      axios.post(
        `http://webpostservice.com/sendsms_v2.0/sendsms.php?apikey=ZHJlYW1wbGFUOkg5WmlCRFZJ&type=TEXT&sender=AOCHLE&mobile=${mobileNumber}&message=${masg}`
      );
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });

      // ZHJlYW1wbGFUOkg5WmlCRFZJ
    } catch (err) {
      return res.status(200).json([{ msg: err.message, res: "error" }]);
    }
  }
};

module.exports = generateOtp;

// const fs = require("fs");
// const request = require("request");
// const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");

// let transporter = nodemailer.createTransport(
//   smtpTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//       user: "",
//       pass: "",
//     },
//   })
// );

// const helper = {
//   get: (options) => {
//     return new Promise((resolve, reject) => {
//       request(options, function (error, response, body) {
//         if (error) reject(error);
//         resolve(JSON.parse(body).secure_url);
//       });
//     });
//   },
//   sendEmail: async (res, email, subject, messageBody) => {
//     try {
//       let mailOptions = {
//         from: "", //sender Email
//         to: email, //Receiver
//         subject: subject,
//         html: messageBody,
//       };
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//           return res.status(500).send({
//             message: "something went wrong",
//             success: false,
//           });
//         } else {
//           console.log("Email sent: " + info.response);
//           return res.status(200).json({
//             message: "Email sent:",
//             details: {
//               email,
//               subject,
//               messageBody,
//             },
//             information: info.response,
//             success: true,
//           });
//         }
//       });
//     } catch (error) {
//       console.log("🚀 ~ file: comon.js ~ line 5 ~ sendEmail ~ error", error);
//     }
//   },
// };
// module.exports = helper;
