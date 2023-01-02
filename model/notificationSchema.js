const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const NotificationSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please Provide sender Id"],
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: [false, "Please Provide receiver Id"],
    },
    type: {
      type: String,
      enum: ["ChangeStatus", "Rating", "Reply", "Report", "BookedRide", "cancleBookedRide", "Self"],
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
  },
  { toJSON: { virtuals: true } }
);
const NotificationSchemas = mongoose.model("Notification", NotificationSchema);
module.exports = NotificationSchemas;
