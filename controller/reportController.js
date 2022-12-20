const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require("../model/userModel");
const Vehicle = require("../model/vehicleModel");
const Chat = require("../model/chatModel");
const Report = require("../model/reportModel");
require("dotenv").config();

exports.createReport = async (req, res, next) => {
  // const user = req.user;

  try {
    let { userId, reportUId, preDefindMessage, userMessage } = req.body;
    const report = await Report.create({
      userId: userId,
      reportUId: reportUId,
      preDefindMessage: preDefindMessage,
      userMessage: userMessage,
    });
    res.status(200).json({
      status: true,
      message: " Create Report Succussefully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

// get report
exports.getReport = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppErr("Pelase Provide userId"), 200);

  const rideBookedRide = await Report.find({ userId: userId });
  res.status(200).json({
    status: true,
    message: "Get report Successfully By uerId",
    rideBookedRide,
  });
});

// 770 834
