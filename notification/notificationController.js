const path = require("path");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/AppErr");
const Notification = require("../model/notificationSchema");
const getISTTime = require("../helpers/getISTTime");
const Rating = require("../model/ratingModel");
const { web, mobile } = require("../helpers/notificationRe");

// firebase
const Token = require("../model/fireBaseSchema");
const firebase = require("../notification/firebase");
// firebase

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
  // console.log(notification, "notification");
};

/// self
module.exports.postNotificationSelf = async (sender, type, message) => {
  console.log("length", global?.onlineUsers?.length);
  if (global?.onlineUsers?.length) {
    // console.log(global?._onlineUsers);
    const io = global.io;
    // const receive = receiver;
    const receive = getUser(sender);
    // console.log("receive", receive);
    if (receive) {
      // console.log("okkkkkkkkkkkk");
      io.to(receive.socketId).emit("getNotification", {
        sender: sender,
        type: type,
        message: message,
        createdOn: getISTTime(new Date(Date.now())),
      });
    }
  }
  const notification = await Notification.create({
    sender: sender,
    type: type,
    message: message,
  });
  console.log(notification, "notification");
};
exports.getAllNotifications = async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  // let page = req.query.pageNo || 1;
  // let limit = req.query.limit || 1000;
  // let skip = (page - 1) * limit;
  const getAllNotifications = await Notification.find({ receiver: id }).sort({ _id: -1 }).populate({
    path: "sender",
    select: "firstName lastName profilePicture",
    model: "User",
  });
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

/// get notification by self

exports.getAllNotificationsBySelf = async (req, res, next) => {
  const { id } = req.body;

  const getAllNotifications = await Notification.find({ $and: [{ sender: id }, { type: "Self" }] })
    .sort({ _id: -1 })
    .populate({
      path: "sender",
      select: "firstName lastName profilePicture",
      model: "User",
    });
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

////////////////

module.exports.sendnotification = async (req, res, next) => {
  const data_object = {
    sender: req.body.sender,
    receiver: req.body.receiver,
    type: "Rating",
    message: req.body.message,
  };
  const notification = new Notification(data_object);
  console.log(notification, "notification");
  const err = notification.joiValidate(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };

    res.status(400).send(final);
  } else {
    notification.save(function (err, result) {
      if (result) {
        // get all tokens
        var response = "";
        Token.find({}, async function (err, tokens) {
          var count = 0;
          if (tokens) {
            for (each of tokens) {
              var data = {
                body: req.body.message,
                title: req.body.sender,
              };
              response = await firebase.sendNotification(each.token, data);
              console.log(response, "response");
              count++;
            }
          }
          var final = {
            res: "success",
            msg: count + " Notification sent successfully.",
            data: result,
          };
          res.status(200).send(final);
        });
      } else {
        var final = {
          res: "error",
          msg: "Something went wrong!",
        };
        res.status(400).send(final);
      }
    });
  }
};

// module.exports = router;
