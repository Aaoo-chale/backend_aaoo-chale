const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const User = require("../model/userModel");
const Schema = mongoose.Schema;
const ChatSchema = new Schema(
  {
    //   message: {
    //     type: String,
    //     required: true,
    //   },
    //   users: [
    //     {
    //       senderId: {
    //         type: String,
    //         required: true,
    //       },
    //       receiverId: {
    //         type: String,
    //         required: true,
    //       },
    //     },
    //   ],
    //   sender: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //     required: true,
    //   },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: [false, "Please Provide message"],
      trim: true,
    },
    createdOn: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
    // status: {
    //   type: Boolean,
    //   required: [false, "Please Provide status"],
    //   trim: true,
  },
  // },
  { toJSON: { virtuals: true } }
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
