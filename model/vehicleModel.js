const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
      required: [true, "Please Provide carModel"],
      trim: true,
    },
    carType: {
      type: String,
      required: [true, "Please Provide carType"],
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
    vehiclePic: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { toJSON: { virtuals: true } }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;
