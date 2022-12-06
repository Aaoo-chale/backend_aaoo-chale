const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Vehicle = require("../model/vehicleModel");
const VehicleImageSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  vehicleImage: String,
  // {
  //   data: Buffer,
  //   contentType: String,
  // },
  vehicleId: {
    type: mongoose.Schema.ObjectId,
    ref: "Vehicle",
  },
});

const vehicleImage = mongoose.model("vehicleImage", VehicleImageSchema);
module.exports = vehicleImage;
