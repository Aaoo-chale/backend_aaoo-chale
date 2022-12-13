const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const Schema = mongoose.Schema;

const rideSchema = new Schema({
  pickUpLocation: {
    type: String,
    required: [false, "Please Provide pickUpLocation"],
    trim: true,
  },
  //doble
  pickupLat: {
    type: String,
    required: [false, "Please Provide pickupLat"],
    trim: true,
  },
  //doble
  pickLong: {
    type: String,
    required: [false, "Please Provide pickLong"],
    trim: true,
  },

  dropLocation: {
    type: String,
    required: [false, "Please Provide dropLocation"],
    trim: true,
  },
  //doble
  dropLat: {
    type: String,
    required: [false, "Please Provide dropLat"],
    trim: true,
  },
  //doble
  dropLong: {
    type: String,
    required: [false, "Please Provide dropLong"],
    trim: true,
  },
  stopCity: {
    type: String,
    required: [false, "Please Provide stopCity"],
    trim: true,
  },
  stopCityLat: {
    type: String,
    required: [false, "Please Provide stopCityLat"],
    trim: true,
  },
  //doble
  stopCityLong: {
    type: String,
    required: [false, "Please Provide stopCityLong"],
    trim: true,
  },
  tripDate: {
    type: Date,
    required: [false, "Please Provide tripDate"],
    trim: true,
  },
  tripTime: {
    type: String,
    required: [false, "Please Provide tripTime"],
    trim: true,
  },
  totalDistance: {
    type: String,
    required: [false, "Please Provide totalDistance"],
    trim: true,
  },
  totalTime: {
    type: String,
    required: [false, "Please Provide totalTime"],
    trim: true,
  },
  backSeatEmpty: {
    type: String,
    required: [false, "Please Provide backSeatEmpty"],
    trim: true,
  },
  passengerCount: {
    type: Number,
    required: [false, "Please Provide passengerCount"],
    trim: true,
  },
  select_route: {
    type: String,
    required: [false, "Please Provide passengerCount"],
    trim: true,
  },
  rideApproval: {
    type: String,
    required: [false, "Please Provide rideApproval"],
    trim: true,
  },

  tripPrise: {
    type: String,
    required: [false, "Please Provide tripPrise"],
    trim: true,
  },
  extraMessage: {
    type: String,
    required: [false, "Please Provide extraMessage"],
    trim: true,
  },
  status: {
    type: Boolean,
    required: [false, "Please Provide status"],
    trim: true,
  },
  vehicleSelect: {
    type: mongoose.Schema.ObjectId,
    ref: "Vehicle",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
