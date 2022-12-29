// const path = require("path");
// const catchAsync = require(path.join(__dirname, "..", "..", "utils", "catchAsync"));
// const AppErr = require(path.join(__dirname, "..", "..", "utils", "AppErr"));
// const Notification = require(path.join(__dirname, "..", "..", "model", "NotificationSchema"));
// const getISTTime = require(path.join(__dirname, "..", "..", "helpers", "getISTTime"));
// const Rating = require("../model/ratingModel");
// // const { web, mobile } = require("../../helpers/notification");
// // // HELPER FUNCTION
// // const getUser = (username) => {
// //   const onlineUsers = global._onlineUsers;
// //   // console.log("ONLINE USERS", onlineUsers);
// //   return onlineUsers.find((user) => {
// //     // console.log("someUser", user, username);
// //     return user.username == username.toString();
// //   });
// // };
// exports.postNotification = async (sender, receiver, type, message) => {
//   // console.log("length", global?._onlineUsers?.length);
//   //   if (global?._onlineUsers?.length) {
//   //     // console.log(global?._onlineUsers);
//   //     const io = global._io;
//   //     const receive = getUser(receiver.user);
//   //     // console.log("receive", receive);
//   //     if (receive) {
//   //       io.to(receive.socketId).emit("getNotification", {
//   //         sender: sender,
//   //         receiver: receiver,
//   //         type: type,
//   //         webUrl: web,
//   //         mobileUrl: mobile,
//   //         message: message,
//   //         createdOn: getISTTime(new Date(Date.now())),
//   //       });
//   //     }
//   //   }
//   const notification = await Notification.create({
//     sender: sender,
//     receiver: receiver,
//     type: type,
//     message: message,
//     createdOn: getISTTime(new Date(Date.now())),
//   });
// };
// exports.getAllNotifications = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   let page = req.query.pageNo || 1;
//   let limit = req.query.limit || 1000;
//   let skip = (page - 1) * limit;
//   const getAllNotifications = await Notification.find({ "receiver.user": user._id })
//     .sort({ _id: -1 })
//     .skip(skip)
//     .limit(limit);
//   res.status(200).json({
//     status: "success",
//     lengt: getAllNotifications.length,
//     data: getAllNotifications,
//   });
// });
// exports.getNotificationById = catchAsync(async (req, res, next) => {
//   const { id } = req.query;
//   const notificationById = await Notification.findById({ _id: id });
//   res.status(200).json({
//     status: "success",
//     data: notificationById,
//   });
// });
// exports.deleteNotifications = catchAsync(async (req, res, next) => {
//   const { id } = req.query;
//   const deleteNotification = await Notification.findByIdAndDelete({ _id: id });
//   res.status(200).json({
//     status: "success",
//     data: deleteNotification,
//   });
// });
