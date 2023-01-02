const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require("../model/userModel");
const Vehicle = require("../model/vehicleModel");
const Chat = require("../model/chatModel");
require("dotenv").config();

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-email -mobile -DOB -ride -__v");
    res.status(200).json({
      status: true,
      msg: "Get all users successfully",
      users,
    });
  } catch (err) {
    next(err);
  }
};
