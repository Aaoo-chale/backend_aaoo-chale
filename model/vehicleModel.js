const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getISTTime = require("../helpers/getISTTime"); //"..", "helpers", "getISTTime"));
const User = require("../model/userModel");
const VehicleSchema = new Schema(
  {
    vehicleRegiNumb: {
      type: String,
      required: [false, "Please Provide VehiclevRegistration Number"],
      trim: true,
    },
    carBrand: {
      type: String,
      required: [false, "Please Provide carBrand"],
      trim: true,
    },
    carModel: {
      type: String,
      required: [false, "Please Provide carModel"],
      trim: true,
    },
    carType: {
      type: String,
      required: [false, "Please Provide carType"],
      trim: true,
    },
    carColor: {
      type: String,
      required: [false, "Please Provide carType"],
      trim: true,
    },
    manufacturYear: {
      type: String,
      required: [false, "Please Provide manufacturYear"],
      trim: true,
    },
    seatCount: {
      type: String,
      required: [false, "Please Provide seatCount"],
      trim: true,
    },
    colorCode: {
      type: String,
      required: [false, "Please Provide colorCode"],
      trim: true,
    },
    createdOn: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
    vehicleimage: String,
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [false, "Please Provide userId"],
      ref: "User",
    },
  },
  { toJSON: { virtuals: true } }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;
