const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require("../model/userModel");
const Vehicle = require("../model/vehicleModel");
const Chat = require("../model/chatModel");
require("dotenv").config();

// // // create chat controller
// // exports.createChat = async (req, res, next) => {
// //   // const user = req.user;

// //   try {
// //     let { senderId, createdOn, receiverId, message, status } = req.body;
// //     const chat = await Chat.create({
// //       senderId: senderId,
// //       receiverId: receiverId,
// //       message: message,
// //       status: status,
// //       createdOn: createdOn,
// //     });
// //     res.status(200).json({
// //       status: true,
// //       message: "Chat Create Succussefully",
// //       data: {
// //         chat,
// //       },
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // get all chat
// exports.getAllChat = async (req, res, next) => {
//   try {
//     const getAllChat = await Chat.find({});
//     res.status(200).json({
//       status: true,
//       message: "Get All Chat Succussefully",
//       getAllChat,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// create chat
exports.createChat = async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const data = await Chat.create({
      message: message,
      senderId: senderId,
      receiverId: receiverId,
    });

    res.status(200).json({
      status: true,
      data,
    });
  } catch (ex) {
    next(ex);
  }
};

// get chate
exports.getAllChat = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    const messages = await Chat.find({
      $all: [{ senderId: senderId }, { receiverId: receiverId }],
    });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.senderId == senderId,
        message: msg.message,
      };
    });
    console.log(projectedMessages, "projectedMessages");
    res.status(200).json({
      status: true,
      projectedMessages,
    });
  } catch (ex) {
    next(ex);
  }
};

// get all chat by senderId
exports.getAllChatBySenderId = async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide Sender Id"), 200);
  try {
    const getAllChat = await Chat.find({ senderId: id }).populate({
      path: "senderId",
      select: "firstName lastName profilePicture chattiness music smoking pets startRating",
      model: "User",
    });
    res.status(200).json({
      status: true,
      message: "Get All Chat By Sender Id Succussefully",
      getAllChat,
    });
  } catch (error) {
    next(error);
  }
};

// get all chat by receiverId
exports.getAllChatByReceiverId = async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide Receiver Id"), 200);
  try {
    const getAllChat = await Chat.find({ receiverId: id }).populate({
      path: "senderId",
      select: "firstName lastName profilePicture chattiness music smoking pets startRating",
      model: "User",
    });
    res.status(200).json({
      status: true,
      message: "Get All Chat By Receiver Id Succussefully",
      getAllChat,
    });
  } catch (error) {
    next(error);
  }
};

// get all chat by senderId and receiverId
exports.getAllChatBySenderIdAndReceiverId = async (req, res, next) => {
  const { senderId, receiverId } = req.body;
  if (!senderId) return next(new AppErr("Pelase Provide Sender Id"), 200);
  if (!receiverId) return next(new AppErr("Pelase Provide Receiver Id"), 200);
  try {
    const getAllChat = await Chat.find({ senderId: senderId, receiverId: receiverId });
    res.status(200).json({
      status: true,
      message: "Get All Chat By Sender Id And Receiver Id Succussefully",
      getAllChat,
    });
  } catch (error) {
    next(error);
  }
};

//
// exports.getUserChatHistory = async (req, res, next) => {
//   // const user = req.user;
//   const { id } = req.body;
//   if (!id) return next(new AppErr("Pelase Login"), 200);
//   try {
//     const getAllChat = await Chat.find({ $or: [{ senderId: id }, { receiverId: id }] });
//     res.status(200).json({
//       status: true,
//       message: "Get All Chat History Succussefully",
//       getAllChat,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
