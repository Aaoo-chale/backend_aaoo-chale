const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const Schema = mongoose.Schema;

const rideCancleSchema = new Schema({
  // Isme rideid, userId, cancel massage, rideStatus
  userId: {
    type: String,
    required: [true, "Please Provide userId"],
    trim: true,
  },
  rideid: {
    type: String,
    required: [true, "Please Provide rideid"],
    trim: true,
  },
  //doble
  massage: {
    type: String,
    required: [true, "Please Provide massage"],
    trim: true,
  },
  rideStatus: {
    type: String,
    required: [true, "Please Provide rideStatus"],
    enum: ["Created", "Booked", "Cancel"],
    trim: true,
  },
});

const cancleRide = mongoose.model("cancleRide", rideCancleSchema);
module.exports = cancleRide;
