const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../model/userModel");
const VehicleSchema = new Schema(
  {
    carBrand: {
      type: String,
      required: true,
      trim: true,
    },
    carModel: {
      type: String,
      required: true,
      trim: true,
    },
    carType: {
      type: String,
      required: true,
      trim: true,
    },
    carColor: {
      type: String,
      required: true,
      trim: true,
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
