const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });
// const axios = require("axios");
const TWILIO_ACC_SID = "AC96af7b6e9bc1bf94e10447f39110207c";
const TWILIO_AUTH_TOKEN = "71a4ebd4b78f8b089a7c2ccf4f73ee95";
const TWILIO_SERVER_MOBILE = +19706967159;
const twilio = require("twilio");
// (process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN);
const Email = require(path.join(__dirname, "..", "utils", "Email"));
// this function only sends otp to mailtrap for email and password otp verification, but can be configured for mobile as well
const generateOtp = async function (mode, user, message, body) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const date = Date.now() + 10 * 60 * 1000;
  user[`verificationToken`][`${mode}Token`] = otp;
  user[`verificationToken`][`${mode}TokenExpiry`] = date;
  await user.save();
  // SENDING OTP TO USER PART
  if (mode === "email") {
    try {
      await new Email(user, otp).send(message, body);
    } catch (error) {
      console.log("EMAIL ERROR", error);
    }
  }
  if (mode === "mobile") {
    // const mobileNumber = user.mobile.mobileNumber;
    // //send mobile otp
    // const twilSMSOption = {
    //   from: process.env.TWILIO_SERVER_MOBILE,
    //   to: mobileNumber,
    //   // messagingServiceSid: "MG4ea94fc1141f49a4db600bb5474f84e9",
    //   body: `Aaoo-chale verification code is ${otp}. Valid for 10 minutes`,
    // };
    // await twilio.messages.create(twilSMSOption);
    // // try {
    // //   await axios({
    // //     method: "post",
    // //     url: `http://login.wishbysms.com/api/sendhttp.php?authkey=385083AFyfh9O163732bcfP1&mobiles=${mobileNumber}&message=(${otp}) is your One Time Password(OTP) to confirm your mobile number at SLWORLDJOBS.COM&sender=SLWORL&route=4&country=91&DLT_TE_ID=1307166780842464065`,
    // //   });
    // // } catch (err) {
    // //   throw err;
    // // }
  }
  // if (mode === "password") {
  //   await new Email(user, otp).send(message, body);
  // }
};

module.exports = generateOtp;
