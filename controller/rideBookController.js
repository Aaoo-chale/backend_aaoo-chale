const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
const BookedRide = require("../model/rideBookingModel");
// const moment = require("moment");

exports.bookedRide = async (req, res, next) => {
  //   const user = req.user;
  //   console.log(user);
  try {
    let { userId, rideId, status } = req.body;
    if (!userId || !rideId) return next(new AppErr("Please Provide all details"), 200);

    const bookedRide = await BookedRide.create({
      user: userId,
      ride: rideId,
      status: status,
    });
    console.log(bookedRide);
    res.status(200).json({
      status: true,
      message: "Booked Ride Succussefully",
      data: {
        bookedRide,
      },
    });
  } catch (error) {
    next(error);
  }
};

// update booked ride
exports.cancleBookedRide = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, status } = req.body;

  if (!id || !status) return next(new AppErr("Pelase Provide User Id"), 200);
  const updateRide = await BookedRide.findByIdAndUpdate(
    { _id: id },
    { status: status },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  // save data
  await updateRide.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Update Ride Successfully",
      updateRide,
    },
  });
});

// get booked ride

exports.getBookedRide = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppErr("Pelase Provide userId"), 200);

  const rideBookedRide = await BookedRide.find({ user: userId }).populate({
    path: "ride",
    model: "Ride",
  });
  // .select(
  //   "-totalDistance -backSeatEmpty -passengerCount -tripPrise -extraMessage -vehicleSelect -rideApproval"
  // );
  res.status(200).json({
    status: true,
    message: "Get ride detail Successfully By User Id",
    rideBookedRide,
  });
});
// delete booked ride
exports.deleteRide = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide Ride Id"), 200);

  const rideDelete = await BookedRide.findByIdAndDelete({ _id: id });
  res.status(200).json({
    status: true,
    message: "Delete Ride Successfully By Ride Id",
    rideDelete,
  });
});

// already booked passenger
exports.getAlreadyBookedPassenger = catchAsync(async (req, res, next) => {
  const { rideId } = req.body;
  if (!rideId) return next(new AppErr("Pelase Provide userId"), 200);

  const bookedPassenger = await BookedRide.find({ $and: [{ ride: rideId }, { status: "Booked" }] }).populate({
    path: "user",
    select: "-email -mobile -createdOn -bio -DOB -ride -__v",
    model: "User",
  });
  // .select(
  //   "-totalDistance -backSeatEmpty -passengerCount -tripPrise -extraMessage -vehicleSelect -rideApproval"
  // );
  res.status(200).json({
    status: true,
    message: "Get Booked Passenger detail Successfully By rideId",
    bookedPassenger,
  });
});

// find({
//   $and: [{ ride: rideId }, { status: status }],
// });
