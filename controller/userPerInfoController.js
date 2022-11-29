const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const encryptPassword = require(path.join(__dirname, "..", "helpers", "encryptPassword"));
const User = require(path.join(__dirname, "..", "model", "userModel"));

// add user personal info
exports.addUserPersoInfo = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { name, emailId } = req.body;
  user.name = name;
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

// get user personal info
exports.getUserPersoInfo = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppErr("Please Login User"), 500);
  res.status(200).json({
    status: true,
    data: {
      message: "Get User Personal information",
      user,
    },
  });
});
