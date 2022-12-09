const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const encryptPassword = require(path.join(__dirname, "..", "helpers", "encryptPassword"));
const User = require(path.join(__dirname, "..", "model", "userModel"));

// add user personal info
exports.addUserPersoInfo = catchAsync(async (req, res, next) => {
  const user = req.user;
  // console.log(user);
  const { firstName, lastName, emailId } = req.body;
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = { emailId };
  await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
});

// user update personal info
exports.updateUserPersoInfo = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  const { firstName, lastName, emailId, gender, DOB, bio, mobileNumber } = req.body;

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

// // add preferances
// exports.addPreferences = catchAsync(async (req, res, next) => {
//   const user = req.user;

//   // const {}
// });
// get user personal info
exports.getUserPersoInfo = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
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

//
exports.updateUserPreferences = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, chattiness, music, smoking, pets } = req.body;

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
