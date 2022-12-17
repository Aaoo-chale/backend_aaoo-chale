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
      await new Email(user, otp).send(message, body);
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

// try {
//   let response = await axios.get(
//     `https://webpostservice.com/sendsms_v2.0/sendsms.php?apikey=ZHJlYW1wbGFUOkg5WmlCRFZJ&type=TEXT&sender=TLIGHT&mobile=${mobileNumber}&message=${otp}&peId=XXXX&tempId=1207167102364450296`
//     // `http://www.smsstanch.in/API/sms.php?username=beats&password=123456&from=BEATSF&to=${number}&msg=${msg}&dnd_check=0&template_id=1007164482764680412`
//   );
