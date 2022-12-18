const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const Schema = mongoose.Schema;
const User = require("../model/userModel");
const Ride = require("../model/rideModel");
const BookedRideSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    ride: {
      type: mongoose.Schema.ObjectId,
      ref: "Ride",
    },
    // message: {
    //   type: String,
    //   required: [false, "Please Provide message"],
    //   trim: true,
    // },
    createdOn: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
    status: {
      type: String,
      required: ["Booked", "Unbooked"],
      trim: true,
    },
  },
  { toJSON: { virtuals: true } }
);

const BookedRide = mongoose.model("BookedRide", BookedRideSchema);
module.exports = BookedRide;
