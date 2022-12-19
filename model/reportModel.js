// Report Schema 1. Userid (ji person report karega) 2. Report id (jisko wo report karega) 3. message (predefind message select by user) 4. write message (user details me apne message likh sakta hai)
const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const User = require("../model/userModel");
const Schema = mongoose.Schema;
const reportSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    reportUId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    preDefindMessage: {
      type: String,
      required: [false, "Please Provide preDefindMessage"],
      trim: true,
    },
    userMessage: {
      type: String,
      required: [false, "Please Provide userMessage"],
      trim: true,
    },
    createdOn: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
  },
  { toJSON: { virtuals: true } }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
