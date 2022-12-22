const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
const BookedRide = require("../model/rideBookingModel");
const cancleRide = require("../model/rideCancleModel");

// exports.cancleBookedRide = catchAsync(async (req, res, next) => {
//   // const user = req.user;
//   // const { id } = req.body;
//   const { id, status } = req.body;

//   if (!id || !status) return next(new AppErr("Pelase Provide User Id"), 200);
//   const updateRide = await cancleRide.findByIdAndUpdate(
//     { _id: id },
//     { status: status },
//     { runValidator: true, useFindAndModify: false, new: true }
//   );
//   // save data
//   await updateRide.save();
//   // change in ride model status
//   const updateRides = await Ride.findByIdAndUpdate(
//     { _id: id },
//     { status: status },
//     { runValidator: true, useFindAndModify: false, new: true }
//   );
//   res.status(200).json({
//     status: true,
//     data: {
//       message: "Update Ride Successfully",
//       updateRide,
//     },
//   });
// });
