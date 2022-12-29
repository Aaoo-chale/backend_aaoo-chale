const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const NotificationSchema = new Schema({
  sender: {
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please Provide sender Id"],
    },
  },
  receiver: {
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please Provide receiver Id"],
    },
  },
  type: {
    type: String,
    enum: [
      "ChangeStatus",
      "Rating",
      "RequestedDocument",
      "UploadedDocument",
      "CandidateStatus",
      "Interview",
      "User_Verified",
      "User_Rejected",
      "Document_Rejected",
    ],
  },
  message: {
    type: String,
  },
  // status: {
  //   type: String,
  //   default: "UNREAD",
  //   enum: ["READ", "UNREAD"],
  // },
  // webUrl: {
  //   type: String,
  // },
  // mobileUrl: {
  //   type: String,
  // },
  createdOn: {
    type: Date,
    default: getISTTime(new Date(Date.now())),
  },
});
const NotificationSchemas = mongoose.model("Notification", NotificationSchema);
module.exports = NotificationSchemas;
