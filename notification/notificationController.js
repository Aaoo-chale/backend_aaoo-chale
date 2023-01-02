const path = require("path");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/AppErr");
const Notification = require("../model/notificationSchema");
const getISTTime = require("../helpers/getISTTime");
const Rating = require("../model/ratingModel");
const { web, mobile } = require("../helpers/notificationRe");
// // HELPER FUNCTION
const getUser = (username) => {
  const onlineUsers = global.onlineUsers;
  // console.log("ONLINE USERS", onlineUsers);
  return onlineUsers.find((user) => {
    // console.log("someUser", user, username);
    return user.username == username.toString();
  });
};

// console.log("getUser", getUser);
module.exports.postNotification = async (sender, receiver, type, message) => {
  console.log("length", global?.onlineUsers?.length);
  if (global?.onlineUsers?.length) {
    // console.log(global?._onlineUsers);
    const io = global.io;
    // const receive = receiver;
    const receive = getUser(receiver);
    // console.log("receive", receive);
    if (receive) {
      // console.log("okkkkkkkkkkkk");
      io.to(receive.socketId).emit("getNotification", {
        sender: sender,
        receiver: receiver,
        type: type,
        message: message,
        createdOn: getISTTime(new Date(Date.now())),
      });
    }
  }
  const notification = await Notification.create({
    sender: sender,
    receiver: receiver,
    type: type,
    message: message,
  });
  console.log(notification, "notification");
};
exports.getAllNotifications = async (req, res, next) => {
  const user = req.user;
  const { id } = req.body;
  let page = req.query.pageNo || 1;
  let limit = req.query.limit || 1000;
  let skip = (page - 1) * limit;
  const getAllNotifications = await Notification.find({ receiver: id }).sort({ _id: -1 }).skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    lengt: getAllNotifications.length,
    data: getAllNotifications,
  });
};
exports.getNotificationById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const notificationById = await Notification.findById({ _id: id });
  res.status(200).json({
    status: "success",
    data: notificationById,
  });
});

exports.deleteNotifications = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const deleteNotification = await Notification.findByIdAndDelete({ _id: id });
  res.status(200).json({
    status: "success",
    data: deleteNotification,
  });
});
