const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const router = express.Router();
router.post("/signup", userAuthController.signup);
router.post("/loginWithPassword", userAuthController.loginWithPassword);
router.post("/login", userAuthController.login);
router.post("/loginMobileOTP", userAuthController.loginMobileOTP);
router.get("/logout", userAuthController.logout);
router.post("/forgotPwdGenerateOtp", userAuthController.forgotPwdGenerateOtp);
router.post("/forgotPwdVerifyOtp", userAuthController.forgotPwdVerifyOtp);
router.post("/verifyMobileSendOtp", userAuthController.verifyMobileSendOtp);
router.post("/verifyReceivedMobileOTP", userAuthController.verifyReceivedMobileOTP);
router.use(userAuthController.protect); //below this protected routes
router.patch("/resetPassword", userAuthController.resetPassword);
// router.post("/uploadProfilePicture", userAuthController.uploadProfilePictureFS);
// router.get("/getProfilePicture", userAuthController.getProfilePicture);//

// TESTING ROUTE
router.get("/test-route", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "user is able to login.....",
      doc: req.user,
    },
  });
});

module.exports = router;
