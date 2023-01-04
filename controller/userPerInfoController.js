const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const encryptPassword = require(path.join(__dirname, "..", "helpers", "encryptPassword"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const notificationController = require("../notification/notificationController");

// add user personal info
exports.addUserPersoInfo = async (req, res, next) => {
  // const user = req.user;
  // console.log(user);
  const { id, firstName, lastName, emailId } = req.body;
  if (!id || !firstName || !lastName) {
    return next(new AppErr("Please Provide id, firstName, lastName", 200));
  }
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  user.email = { emailId };
  console.log(user);
  // save data
  await user.save();
  await notificationController.postNotificationSelf(
    id,
    "Self",
    "Please verify your Govt ID people get more trust in verified IDs."
  );

  ////

  // pushnotification single

  ////
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
};
// });

// user update personal info
exports.updateUserPersoInfo = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, firstName, lastName, emailId, gender, DOB, bio, mobileNumber } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // // chake email present or mot
  // const data = await User.findOne({ "email.emailId": emailId });
  // if (data) return next(new AppErr("Account already exist please add new emailId"), 200);

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  // user.name = name;
  // user.email = { emailId };
  console.log(user);
  // save data
  await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
});

// get user personal info
exports.getUserPersoInfo = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // if (!user) return next(new AppErr("Please Login User"), 200);
  const user = await User.findOne({ _id: id }, "-__v");
  console.log(user);
  res.status(200).json({
    status: true,
    data: {
      message: "Get User Personal information",
      user,
    },
  });
});

// update personal information
exports.updateUserPreferences = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, chattiness, music, smoking, pets } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // // chake email present or mot
  // const data = await User.findOne({ "email.emailId": emailId });
  // if (data) return next(new AppErr("Account already exist please add new emailId"), 200);

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  console.log(user);
  // save data
  await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
});

// email agar verify nai to verify , aur agar email add nai kiyta to add karega uyska notuification
// notification
exports.notificationByEmail = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);
  const user = await User.findOne({ _id: id });

  if (!user.email) {
    await notificationController.postNotificationSelf(id, "Self", "Please Add your EmailId.");
    res.status(200).json({
      status: true,
      data: {
        message: "Notification send successfully",
      },
    });
  } else if (user?.email?.isEmailVerified == false) {
    await notificationController.postNotificationSelf(id, "Self", "Please Add verify your EmailId.");
    res.status(200).json({
      status: true,
      data: {
        message: "Notification send successfully",
      },
    });
  }
});

/// verify user pic

exports.notificationByprofilePicture = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);
  const user = await User.findOne({ _id: id });

  if (user.profilePicture == " ") {
    await notificationController.postNotificationSelf(id, "Self", "Please Add your profilePicture.");
    res.status(200).json({
      status: true,
      data: {
        message: "Notification send successfully",
      },
    });
  }
});
