const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });

const { promisify } = require("util");
const generateOtp = require(path.join(__dirname, "..", "helpers", "generateOtp"));
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const encryptPassword = require(path.join(__dirname, "..", "helpers", "encryptPassword"));
const User = require(path.join(__dirname, "..", "model", "userModel"));

// const aws = require("aws-sdk");
// const multerS3 = require("multer-s3");
// const multer = require("multer");
require("dotenv").config();

/// image upload
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dyetuvbqa",
  api_key: "931785857465896",
  api_secret: "hEnL1zZDYVp65zn-S3ZEy66B0bs",
  secure: true,
});

///

// const NODE_ENV = development;
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
  // if (process.env.NODE_ENV === "development") cookieOptions.secure = true; // only for the https

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
// exports.signup = catchAsync(async (req, res, next) => {
//   const { name, password, emailId, mobileNumber } = req.body;
//   if (!name || !emailId || !mobileNumber || !password) {
//     return next(new AppErr("Please Provide all the details to create user", 400));
//   }
//   // CHECK IF USER ALREADY EXISTS
//   const userDoc = await User.findOne({
//     $and: [{ "email.emailId": emailId }, { "mobile.mobileNumber": mobileNumber }],
//   }).select("+password");
//   if (userDoc && !userDoc?.email?.isEmailVerified) {
//     await generateOtp(
//       "password",
//       userDoc,
//       "[SL WORLD JOBS] please verify your email",
//       "complete your Sign Up procedures"
//     );
//     userDoc.password = undefined;
//     return res.status(200).json({
//       status: "success",
//       message: "User Exists With The Provided Email Id, An OTP Has Been Sent To The Registered Email",
//       user: userDoc,
//       data: {
//         duplicateUser: true,
//       },
//     });
//   }
//   if (userDoc && userDoc?.email?.isEmailVerified)
//     return next(new AppErr("User Already Exists with verified email, Please Login to continue", 400));
//   // CANDIDATE
//   if (await User.findOne({ "email.emailId": emailId })) {
//     return next(new AppErr("User Already Exists, Please Login to continue", 400));
//   }
//   const hashedPassword = await encryptPassword.hashPassword(password);
//   const doc = await User.create({
//     name,
//     password: hashedPassword,
//     email: { emailId },
//     mobile: { mobileNumber },
//   });
//   await generateOtp("password", doc, "[SL WORLD JOBS] Please Verify Your Email", "complete your Sign Up procedures");
//   doc.password = undefined;
//   res.status(200).json({
//     status: "success",
//     user: doc,
//   });
// });

// LOGIN with id and password
// exports.loginWithPassword = catchAsync(async (req, res, next) => {
//   // TODO:NO LOGIN TILL EMAIL VERIFIED
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return next(new AppErr("Please Provide all the details to create user", 400));
//   }
//   let doc = await User.findOne({ "email.emailId": email }).select("+password");
//   if (!doc) return next(new AppErr("Mobile is Incorrect", 400));
//   if (!(await encryptPassword.unHashPassword(password, doc.password))) {
//     return next(new AppErr("Password is Incorrect", 400));
//   }
//   // if (!doc?.email?.isEmailVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));//
//   createSendToken(doc, 200, res);
// });

// login with otp
exports.login = catchAsync(async (req, res, next) => {
  // TODO:NO LOGIN TILL EMAIL VERIFIED
  const {
    mobileNumber,
    firstName,
    lastName,
    userStatus,
    profilePicture,
    gender,
    DOB,
    bio,
    emailId,
    chattiness,
    music,
    smoking,
    pets,
  } = req.body;
  if (!mobileNumber) {
    return next(new AppErr("Please Provide all the details to create user", 200));
  }
  let doc = await User.findOne({ "mobile.mobileNumber": mobileNumber });
  if (doc) {
    try {
      console.log("ok", doc);
      await generateOtp("mobile", doc);
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Unable To Send Otp, Please Try Later....",
      });
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Account already exits An OTP has been sent your mobile Number",
      },
    });
  } else {
    const user = await User.create({
      mobile: { mobileNumber },
      email: { emailId } || "",
      firstName: firstName || "",
      lastName: lastName || "",

      profilePicture: profilePicture || "",

      bio: bio || "",
      chattiness: chattiness || "",
      music: music || "",
      smoking: smoking || "",
      pets: pets || "",
    });

    try {
      await generateOtp("mobile", user);
    } catch (err) {
      return res.status(200).json({
        status: "fail",
        message: "Unable To Send Otp, Please Try Later....",
      });
    }

    // if (!doc?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));
    // createSendToken(doc, 200, res);
    res.status(200).json({
      status: true,
      data: {
        message: "Account Create successfully and OTP has been sent Your Mobile",
      },
    });
  }
});

// create jwt by using mobile otp
exports.loginMobileOTP = catchAsync(async (req, res, next) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    res.status(200).json({
      status: false,
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const doc = await User.findOne({ "mobile.mobileNumber": mobile });

  const currDate = new Date(Date.now());
  if (doc?.verificationToken?.mobileTokenExpiry < currDate) return next(new AppErr("OTP Expired", 200));
  // verify otp
  if (!(doc?.verificationToken?.mobileToken === otp)) return next(new AppErr("OTP Entered Is Incorrect", 200));
  // update token fields in document
  doc.verificationToken.mobileToken = undefined;
  doc.verificationToken.mobileTokenExpiry = undefined;
  doc.mobile.isMobileVerified = true;
  let user = await doc.save();
  // check mobile is very or not
  if (!user?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Mobile Address To Login", 200));

  createSendToken(user, 200, res);
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
    return next(new AppErr("You are not logged  in!!! Please log in to get access.", 200));
  }

  //2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Get if user still exists

  const id = decoded?.id?.split("--")[1];
  if (!id) return next(new AppErr("JWT Malformed"), 200);
  const currentUser = await User.findById(id);

  if (!currentUser) {
    return next(new AppErr(" The user blonging to this token no longer exists", 200));
  }

  //4) Check if user change password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppErr("App user recently changed password! Please log in again", 200));
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
    res.status(200).json({
      status: false,
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const user = await User.findOne({ "email.emailId": email });
  if (!user) return next(new AppErr("Account Not Found"), 200);
  await generateOtp("email", user);
  res.status(200).json({
    status: true,
    data: {
      verificationToken: user.verificationToken,
      message: "An OTP has been sent,Please Verify Email",
    },
  });
});
// 2) verify otp email
exports.forgotPwdVerifyOtp = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;
  if (!email) {
    res.status(200).json({
      status: false,
      data: {
        message: "Please Provide All The Details",
      },
    });
  }

  const doc = await User.findOne({ "email.emailId": email });
  if (!doc) return next(new AppErr("Account Not Found"), 200);
  // check if token is present
  if (!doc?.verificationToken?.emailToken && !doc?.verificationToken?.emailTokenExpiry)
    return next(new AppErr("Token Not Issued, Route Is FORBIDDEN", 200));
  // check if time expired
  const currDate = new Date(Date.now());
  if (doc?.verificationToken?.emailTokenExpiry < currDate) return next(new AppErr("OTP Expired", 200));
  // verify otp
  if (!(doc?.verificationToken?.emailToken === otp)) return next(new AppErr("OTP Entered Is Incorrect", 200));
  // update token fields in document
  doc.verificationToken.emailToken = undefined;
  doc.verificationToken.emailTokenExpiry = undefined;
  doc.email.isEmailVerified = true;
  await doc.save();
  res.status(200).json({
    status: true,
    data: {
      message: "User Email Verified",
      doc,
    },
  });
  createSendToken(doc, 200, res);
});

//3
// RESET PASSWORD
// exports.resetPassword = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   const { password } = req.body;
//   const hashedPassword = await encryptPassword.hashPassword(password);
//   user.password = hashedPassword;
//   user.passwordChangedAt = Date.now() - 1 * 60 * 100;
//   await user.save();
//   createSendToken(user, 200, res);
// });

///////////////////////////////////////////////////////////
// 1) send otp on mobile
exports.verifyMobileSendOtp = catchAsync(async (req, res, next) => {
  const { mobile } = req.body;
  if (!mobile) {
    res.status(200).json({
      status: false,
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const user = await User.findOne({ "mobile.mobileNumber": mobile });
  if (!user) return next(new AppErr("Account Not Found"), 200);
  await generateOtp("mobile", user);

  res.status(200).json({
    status: true,
    data: {
      message: "An OTP has been sent,Please Verify OTP To verify mobile",
    },
  });
});

// verify mobile otp
exports.verifyReceivedMobileOTP = catchAsync(async (req, res, next) => {
  const { otp, mobile } = req.body;
  if (!mobile) {
    res.status(200).json({
      status: false,
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const doc = await User.findOne({ "mobile.mobileNumber": mobile });
  if (!doc) return next(new AppErr("Account Not Found"), 200);
  // check if token is present
  if (!doc?.verificationToken?.mobileToken && !doc?.verificationToken?.mobileTokenExpiry)
    return next(new AppErr("Token Not Issued, Route Is FORBIDDEN", 200));
  // check if time expired
  const currDate = new Date(Date.now());
  if (doc?.verificationToken?.mobileTokenExpiry < currDate) return next(new AppErr("OTP Expired", 200));
  // verify otp
  if (!(doc?.verificationToken?.mobileToken === otp)) return next(new AppErr("OTP Entered Is Incorrect", 200));
  // update token fields in document
  doc.verificationToken.mobileToken = undefined;
  doc.verificationToken.mobileTokenExpiry = undefined;
  doc.mobile.isMobileVerified = true;
  await doc.save();
  res.status(200).json({
    status: true,
    data: {
      message: "User Mobile Verified",
      doc,
    },
  });

  createSendToken(doc, 200, res);
});

// logout
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
    data: {
      message: "User Successfully Logged Out",
    },
  });
});

// // UPLOAD PROFILE PICTURE TO FS
// exports.uploadProfilePictureFS = (req, res, next) => {
//   const uploader = upload.single("profile-picture");
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
// exports.updateMobile = catchAsync(async (req, res, next) => {
//   const { mobileNumber } = req.body;

//   // const user = await User.create({
//   //   mobile: { mobileNumber },
//   // });

//   try {
//     let data = await generateOtp("mobile", mobileNumber, "Please Verify OTP , OTP Expires in 10 Minutes");
//     console.log(data, "data");
//   } catch (err) {
//     return res.status(500).json({
//       status: "fail",
//       message: "Unable To Send Otp, Please Try Later....",
//     });
//   }

//   // if (!doc?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));
//   // createSendToken(doc, 200, res);
//   res.status(200).json({
//     status: true,
//     data: {
//       message: "Account Create successfully and OTP has been sent Your Mobile",
//       data,
//     },
//   });
// });

//

exports.updateMobile = catchAsync(async (req, res, next) => {
  const { id, mobileNumber } = req.body;
  console.log(mobileNumber);

  // const user = await User.findById({ _id: id });
  // console.log(user);

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { mobile: { mobileNumber } },
      { runValidator: true, useFindAndModify: false, new: true }
    );

    var data = await generateOtp("mobile", user);
    console.log(data, "data");
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Unable To Send Otp, Please Try Later....",
    });
  }

  // if (!doc?.mobile?.isMobileVerified) return next(new AppErr("Please Verify Your Email Address To Login", 401));
  // createSendToken(doc, 200, res);
  res.status(200).json({
    status: true,
    data: {
      message: "Otp send your Number",
      data,
    },
  });
});

exports.verifyUpdateMobile = async (req, res, next) => {
  const { id, otp, mobileNumber } = req.body;
  if (!mobileNumber || !id || !otp) {
    res.status(200).json({
      status: false,
      data: {
        message: "Please Provide All The Details",
      },
    });
  }
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { mobile: { mobileNumber } },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  // user.mobile = { mobileNumber };

  const currDate = new Date(Date.now());
  if (user?.verificationToken?.mobileTokenExpiry < currDate) return next(new AppErr("OTP Expired", 200));
  // verify otp
  if (!(user?.verificationToken?.mobileToken === otp)) return "OTP Entered Is Incorrect", 200;
  // update token fields in document
  user.verificationToken.mobileToken = undefined;
  user.verificationToken.mobileTokenExpiry = undefined;
  user.mobile.isMobileVerified = true;
  const doc = await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "User Mobile Verified",
      doc,
    },
  });
};

// ///// images
// const s3 = new aws.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRETE_ACCESS_KEY,
//   region: process.env.S3_BUCKET_RESION,
//   // signatureVersion: "v4",
// });

// module.exports.upload = multer({
//   // fileFilter,
//   storage: multerS3({
//     //acl: "public-read",
//     s3,
//     bucket: process.env.AWS_S3_BUCKET,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.originalname });
//     },
//     key: function (req, file, cb) {
//       cb(null, `${Date.now().toString()}${file.originalname}`);
//     },
//   }),
// });

// exports.uploadUsertImage = async (req, res) => {
//   const [files] = req.files;
//   const { id } = req.body;
// const user = await User.findOne({ _id: id });
//   if (!id) return next(new AppErr("Pelase Provide user Id"), 200);
//   // console.log(files.location, "files");
//   // var data = await User({
//   (user.profilePicture = files.location),
//     // });

//     // console.log(data, "data");
//     await user.save((err, feed) => {
//       if (err) {
//         return res.status(400).json({
//           error: err,
//         });
//       }
//       // res.json(feed);
//       res.send(files);
//     });
// };

exports.uploadUsertImage = async (req, res) => {
  const { id } = req.body;
  const file = req.files.profileimage;
  if (!id) return next(new AppErr("Pelase Provide vehicle Id"), 200);
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    const user = await User.findOne({ _id: id });
    user.profilePicture = result.url;
    await user.save();
    res.status(200).json({
      status: true,
      data: {
        message: "Upload User Image Successfully",
      },
    });
  });
};

// const checkArr = ["aadharCard", "panCard", "drivingLicence"];
/// upload documents
exports.uploadUserDocuments = async (req, res) => {
  const { id, aadharCard, panCard, drivingLicence } = req.body;
  const file = req.files.document;
  if (!id) return next(new AppErr("Pelase Provide vehicle Id"), 200);
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    const user = await User.findOne({ _id: id });
    if (req.body == "aadharCard") {
      user.documents.aadharCard = result.url;
      await user.save();
      res.status(200).json({
        status: true,
        data: {
          message: "User aadharCard Upload Successfully",
        },
      });
    } else if (req.body == "panCard") {
      user.documents.panCard = result.url;
      await user.save();
      res.status(200).json({
        status: true,
        data: {
          message: "User panCard Upload Successfully",
        },
      });
    } else if (req.body == "drivingLicence") {
      user.documents.drivingLicence = result.url;
      await user.save();
      res.status(200).json({
        status: true,
        data: {
          message: "User drivingLicence Upload Successfully",
        },
      });
    } else {
      res.status(200).json({
        status: true,
        data: {
          message: "Please Upload valid Documents",
        },
      });
    }

    user["documents"][checkArr]["aadharCard" || "panCard" || "drivingLicence"] = result.url;
    await user.save();
    res.status(200).json({
      status: true,
      data: {
        message: "Upload User Image Successfully",
      },
    });
  });
};
