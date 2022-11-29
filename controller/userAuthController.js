const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { promisify } = require("util");
const generateOtp = require(path.join(__dirname, "..", "helpers", "generateOtp"));
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const encryptPassword = require(path.join(__dirname, "..", "helpers", "encryptPassword"));
const User = require(path.join(__dirname, "..", "model", "userModel"));

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const payload = `${user}--${user.id}`;

  const token = signToken(payload);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // only for the https

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; // hide password field from the response of document
  res.status(statusCode).json({
    status: "success",
    token: token,
    user: user,
  });
};

//
// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const { name, password, emailId, mobileNumber } = req.body;
  if (!name || !emailId || !mobileNumber || !password) {
    return next(new AppErr("Please Provide all the details to create user", 400));
  }
  // CHECK IF USER ALREADY EXISTS
  const userDoc = await User.findOne({
    $and: [{ "email.emailId": emailId }, { "mobile.mobileNumber": mobileNumber }],
  }).select("+password");
  if (userDoc && !userDoc?.email?.isEmailVerified) {
    await generateOtp(
      "password",
      userDoc,
      "[SL WORLD JOBS] please verify your email",
      "complete your Sign Up procedures"
    );
    userDoc.password = undefined;
    return res.status(200).json({
      status: "success",
      message: "User Exists With The Provided Email Id, An OTP Has Been Sent To The Registered Email",
      user: userDoc,
      data: {
        duplicateUser: true,
      },
    });
  }
  if (userDoc && userDoc?.email?.isEmailVerified)
    return next(new AppErr("User Already Exists with verified email, Please Login to continue", 400));
  // CANDIDATE
  if (await User.findOne({ "email.emailId": emailId })) {
    return next(new AppErr("User Already Exists, Please Login to continue", 400));
  }
  const hashedPassword = await encryptPassword.hashPassword(password);
  const doc = await User.create({
    name,
    password: hashedPassword,
    email: { emailId },
    mobile: { mobileNumber },
  });
  // if (doc.role === "recruiter") {
  //   await RecruiterNotification.create({ recruiterId: doc._id });
  // }
  await generateOtp("password", doc, "[SL WORLD JOBS] Please Verify Your Email", "complete your Sign Up procedures");
  doc.password = undefined;
  res.status(200).json({
    status: "success",
    user: doc,
  });
});

// LOGIN with id and password
exports.loginWithPassword = catchAsync(async (req, res, next) => {
  // TODO:NO LOGIN TILL EMAIL VERIFIED
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppErr("Please Provide all the details to create user", 400));
  }
  let doc = await User.findOne({ "email.emailId": email }).select("+password");
  if (!doc) return next(new AppErr("Mobile is Incorrect", 400));
  if (!(await encryptPassword.unHashPassword(password, doc.password))) {
    return next(new AppErr("Password is Incorrect", 400));
  }
  // if (!doc?.email?.isEmailVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));//
  createSendToken(doc, 200, res);
});

// login with otp
exports.login = catchAsync(async (req, res, next) => {
  // TODO:NO LOGIN TILL EMAIL VERIFIED
  const { mobile } = req.body;
  if (!mobile) {
    return next(new AppErr("Please Provide all the details to create user", 400));
  }
  let doc = await User.findOne({ "mobile.mobileNumber": mobile });
  if (!doc) return next(new AppErr("Mobile is Incorrect", 400));
  try {
    await generateOtp("mobile", doc, "Please Verify OTP , OTP Expires in 10 Minutes");
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Unable To Send Otp, Please Try Later....",
    });
  }
  // if (!doc?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));
  // createSendToken(doc, 200, res);
  res.status(200).json({
    status: "success",
    data: {
      message: "An OTP has been sent,Please Verify OTP To verify mobile",
    },
  });
});

// create jwt by using mobile otp
exports.loginMobileOTP = catchAsync(async (req, res, next) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    res.status(400).json({
      status: "fail",
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const doc = await User.findOne({ "mobile.mobileNumber": mobile });
  if (!doc) return next(new AppErr("Account Not Found"), 400);
  // check if token is present
  if (!doc?.verificationToken?.mobileToken && !doc?.verificationToken?.mobileTokenExpiry)
    return next(new AppErr("Token Not Issued, Route Is FORBIDDEN", 403));
  // check if time expired
  const currDate = new Date(Date.now());
  if (doc?.verificationToken?.mobileTokenExpiry < currDate) return next(new AppErr("OTP Expired", 400));
  // verify otp
  if (!(doc?.verificationToken?.mobileToken === otp)) return next(new AppErr("OTP Entered Is Incorrect", 400));
  // update token fields in document

  if (!doc?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Mobile Address To Login", 401));

  createSendToken(doc, 200, res);
});

//PROTECT route to chake user is login or not
exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting the tocken and check is it exist
  let token;
  if (
    // autharization = "Bearer TOKEN_STRING"
    req?.headers?.authorization &&
    req?.headers?.authorization?.startsWith("Bearer")
  ) {
    token = req?.headers?.authorization?.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req?.cookies?.jwt;
    const cookieToken = req?.cookies?.jwt;
  }
  if (!token) {
    return next(new AppErr("You are not logged  in!!! Please log in to get access.", 401));
  }

  //2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Get if user still exists

  const id = decoded?.id?.split("--")[1];
  if (!id) return next(new AppErr("JWT Malformed"), 401);
  const currentUser = await User.findById(id);

  if (!currentUser) {
    return next(new AppErr(" The user blonging to this token no longer exists", 401));
  }

  //4) Check if user change password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppErr("App user recently changed password! Please log in again", 401));
  }
  // Grant access to protected route
  req.user = currentUser;
  req.identity = id;
  next();
});

// FORGOT PASSWORD STAGES
// 1) verify email
exports.forgotPwdGenerateOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      status: "fail",
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const user = await User.findOne({ "email.emailId": email });
  if (!user) return next(new AppErr("Account Not Found"), 400);
  await generateOtp("password", user, "[SL WORLD JOBS] OTP for password change", "Reset Your Password");
  res.status(200).json({
    status: "success",
    data: {
      verificationToken: user.verificationToken,
      message: "An OTP has been sent,Please Verify OTP To Reset The Password",
    },
  });
});
// 2) verify otp email
exports.forgotPwdVerifyOtp = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;
  if (!email) {
    res.status(400).json({
      status: "fail",
      data: {
        message: "Please Provide All The Details",
      },
    });
  }

  const doc = await User.findOne({ "email.emailId": email });
  if (!doc) return next(new AppErr("Account Not Found"), 400);
  // check if token is present
  if (!doc?.verificationToken?.passwordToken && !doc?.verificationToken?.passwordTokenExpiry)
    return next(new AppErr("Token Not Issued, Route Is FORBIDDEN", 403));
  // check if time expired
  const currDate = new Date(Date.now());
  if (doc?.verificationToken?.passwordTokenExpiry < currDate) return next(new AppErr("OTP Expired", 400));
  // verify otp
  if (!(doc?.verificationToken?.passwordToken === otp)) return next(new AppErr("OTP Entered Is Incorrect", 400));
  // update token fields in document
  doc.verificationToken.passwordToken = undefined;
  doc.verificationToken.passwordTokenExpiry = undefined;
  doc.email.isEmailVerified = true;
  await doc.save();
  res.status(200).json({
    status: "success",
    data: {
      message: "User Email Verified",
      doc,
    },
  });
  createSendToken(doc, 200, res);
});

//3
// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { password } = req.body;
  const hashedPassword = await encryptPassword.hashPassword(password);
  user.password = hashedPassword;
  user.passwordChangedAt = Date.now() - 1 * 60 * 100;
  await user.save();
  createSendToken(user, 200, res);
});

///////////////////////////////////////////////////////////
// 1) send otp on mobile
exports.verifyMobileSendOtp = catchAsync(async (req, res, next) => {
  const { mobile } = req.body;
  if (!mobile) {
    res.status(400).json({
      status: "fail",
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const user = await User.findOne({ "mobile.mobileNumber": mobile });
  if (!user) return next(new AppErr("Account Not Found"), 400);

  await generateOtp("mobile", user, "Please Verify OTP , OTP Expires in 10 Minutes");

  res.status(200).json({
    status: "success",
    data: {
      message: "An OTP has been sent,Please Verify OTP To verify mobile",
    },
  });
});

// verify mobile otp
exports.verifyReceivedMobileOTP = catchAsync(async (req, res, next) => {
  const { otp, mobile } = req.body;
  if (!mobile) {
    res.status(400).json({
      status: "fail",
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const doc = await User.findOne({ "mobile.mobileNumber": mobile });
  if (!doc) return next(new AppErr("Account Not Found"), 400);
  // check if token is present
  if (!doc?.verificationToken?.mobileToken && !doc?.verificationToken?.mobileTokenExpiry)
    return next(new AppErr("Token Not Issued, Route Is FORBIDDEN", 403));
  // check if time expired
  const currDate = new Date(Date.now());
  if (doc?.verificationToken?.mobileTokenExpiry < currDate) return next(new AppErr("OTP Expired", 400));
  // verify otp
  if (!(doc?.verificationToken?.mobileToken === otp)) return next(new AppErr("OTP Entered Is Incorrect", 400));
  // update token fields in document
  doc.verificationToken.mobileToken = undefined;
  doc.verificationToken.mobileTokenExpiry = undefined;
  doc.mobile.isMobileVerified = true;
  await doc.save();
  res.status(200).json({
    status: "success",
    data: {
      message: "User Mobile Verified",
      doc,
    },
  });

  createSendToken(doc, 200, res);
});

//  if (!doc?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));
// logout
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      message: "User Successfully Logged Out",
    },
  });
});

// UPLOAD PROFILE PICTURE TO FS
exports.uploadProfilePictureFS = (req, res, next) => {
  const uploader = upload.single("profile-picture");
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new AppErr(err.message, 500));
    } else if (err) {
      // An unknown error occurred when uploading.
      return next(new AppErr(err.message, 500));
    } else {
      // manually throw errors if file is not presend
      if (!req?.file) return next(new AppErr("Please Provide Required File To Upload Profile Picture", 400));
      return next();
    }
  });
};

// // UPLOAD PROFILE PICTURE TO DB
// exports.uploadProfilePictureDB = catchAsync(async (req, res, next) => {
//   const user = await getUserBypass(req);
//   // set profile picture
//   const profilePictureLink = req?.file?.location;
//   user.profilePictureLink = profilePictureLink;
//   await user.save();
//   res.status(200).json({
//     status: "success",
//     data: {
//       doc: {
//         profilePictureLink,
//       },
//       message: "Profile Picture Updated Successfully",
//     },
//   });
// });

// // FETCH PROFILE PICTURE
exports.getProfilePicture = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log(user);
  // const user = await getUserBypass(req);
  // if (!user.profilePictureLink) return next(new AppErr("User Has No Profile Picture", 400));
  // res.status(200).json({
  //   data: {
  //     doc: {
  //       profilePictureLink: user.profilePictureLink,
  //     },
  //   },
  // });
});

// exports.getCandidateProfilePicture = catchAsync(async (req, res, next) => {
//   const { candidateId } = req.query;
//   if (!candidateId) return next(new AppErr("Please Provide Candidate Id", 400));
//   const user = await Candidate.findOne({ _id: candidateId });
//   if (!user.profilePictureLink)
//     return res.status(200).json({
//       status: "fail",
//       message: "User Does Not Have A Profile Picture",
//     });
//   res.status(200).json({
//     status: "success",
//     data: {
//       doc: {
//         profilePictureLink: user.profilePictureLink,
//       },
//     },
//   });
// });

// exports.deleteProfilePicture = catchAsync(async (req, res, next) => {
//   let user;
//   try {
//     user = await getCandidateUser(req);
//   } catch (err) {
//     return next(err);
//   }
//   if (!user.profilePictureLink) return next(new AppErr("User Has No Profile Picture", 400));
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: user.profilePictureLink,
//   };
//   s3.deleteObject(params, function (err) {
//     if (err) return cb(new Error("Unable To Delete File From S3, Internal Server Error"), false);
//   });
//   user.profilePictureLink = undefined;
//   await user.save();
//   res.status(200).json({
//     data: {
//       message: "Users Profile Picture Successfully Deleted",
//     },
//   });
// });

// // COMPANY LOGO
// // UPLOAD COMPANY LOGO TO FS
// exports.uploadCompanyLogoFS = (req, res, next) => {
//   const uploader = companyLogoUpload.single("company-logo");
//   uploader(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return next(new AppErr(err.message, 500));
//     } else if (err) {
//       // An unknown error occurred when uploading.
//       return next(new AppErr(err.message, 500));
//     } else {
//       // manually throw errors if file is not presend
//       if (!req?.file) return next(new AppErr("Please Provide Required File To Upload Profile Picture", 400));
//       return next();
//     }
//   });
// };

// // UPLOAD COMPANY LOGO TO DB
// exports.uploadCompanyLogoDB = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   // set company logo
//   const companyLogoLink = req?.file?.location;
//   user.companyInformation.companyLogo = companyLogoLink;
//   await user.save();
//   res.status(200).json({
//     status: "success",
//     data: {
//       doc: {
//         companyLogoLink,
//       },
//       message: "Company Logo Uploaded Successfully",
//     },
//   });
// });

// // FETCH COMPANY LOGO
// exports.getCompanyLogo = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   res.status(200).json({
//     data: {
//       doc: {
//         companyLogo: user?.companyInformation?.companyLogo,
//       },
//     },
//   });
// });

// // DELETE COMPANY LOGO
// exports.deleteCompanyLogo = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   let documentLink = user?.companyInformation?.companyLogo;
//   if (!documentLink) return next(new AppErr("No Company Logo Found", 400));
//   const documentLinkArr = documentLink.split("/");
//   documentLink = `${documentLinkArr.at(3)}/${documentLinkArr.at(4)}`;
//   const params = {
//     Bucket: process.env.AWS_PROFILE_PIC_BUCKET_NAME,
//     Key: documentLink,
//   };
//   s3.deleteObject(params, function (err) {
//     if (err) return cb(new Error("Unable To Delete File From S3, Internal Server Error"), false);
//   });
//   user.companyInformation.companyLogo = undefined;
//   await user.save();
//   res.status(200).json({
//     data: {
//       message: "Users Profile Picture Successfully Deleted",
//     },
//   });
// });

// exports.checkRecruiter = (req, res, next) => {
//   const user = req.user;
//   if (user.role !== "recruiter") return next(new AppErr("Please Login As Recruiter To Continue", 403));
//   next();
// };

// exports.checkAgent = (req, res, next) => {
//   const user = req.user;
//   if (user.role !== "agent") return next(new AppErr("Please Login As Agent To Continue", 403));
//   next();
// };
