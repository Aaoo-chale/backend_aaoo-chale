const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require("../model/userModel");
const Vehicle = require("../model/vehicleModel");
const Chat = require("../model/chatModel");
const Report = require("../model/reportModel");
const notificationController = require("../notification/notificationController");

require("dotenv").config();

////////////
const Token = require("../model/fireBaseSchema");
const firebase = require("../notification/firebase");

////

const GetToken = async (userId) => {
  const list = await Token.find({ user_id: userId });

  if (list.length > 0) {
    return list[0].token;
  } else {
    var token = "";
    return token;
  }
};

exports.createReport = async (req, res, next) => {
  // const user = req.user;

  try {
    const { userId, reportUId, preDefindMessage, userMessage } = req.body;
    const report = await Report.create({
      userId: userId,
      reportUId: reportUId,
      preDefindMessage: preDefindMessage,
      userMessage: userMessage,
    });
    await notificationController.postNotification(userId, reportUId, "Report", "one user report.... other user");
    ///////// firebase

    if (reportUId) {
      // console.log("okkkkkkkk");
      var content = {
        title: "You have new Notification please chake.",
        body: userMessage,
        imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
      };
      const key = await GetToken(reportUId);
      console.log(key, "key");

      if (key != "") {
        console.log("okkkkkkkkkkkkkkkk");
        var firebaseres = await firebase.sendNotification(key, content);
      }
    }
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
