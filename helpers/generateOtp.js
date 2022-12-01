const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });
const Email = require(path.join(__dirname, "..", "utils", "Email"));
// this function only sends otp to mailtrap for email and password otp verification, but can be configured for mobile as well
const generateOtp = async function (mode, user, message, body) {
  const otp = Math.floor(1000 + Math.random() * 999);
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
  }
};

module.exports = generateOtp;
