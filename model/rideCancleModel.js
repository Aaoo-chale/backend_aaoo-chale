const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const Schema = mongoose.Schema;

const rideCancleSchema = new Schema({
  // Isme rideid, userId, cancel massage, rideStatus
  userId: {
    type: String,
    required: [false, "Please Provide pickUpLocation"],
    trim: true,
  },
  rideid: {
    type: String,
    required: [false, "Please Provide pickCity"],
    trim: true,
  },
  //doble
  massage: {
    type: String,
    required: [false, "Please Provide pickupLat"],
    trim: true,
  },
  rideStatus: {
    type: String,
    required: [false, "Please Provide status"],
    enum: ["Created", "Booked", "Cancel"],
    trim: true,
  },
});

const cancleRide = mongoose.model("cancleRide", rideCancleSchema);
module.exports = cancleRide;
