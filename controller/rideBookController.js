const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
// const moment = require("moment");

exports.bookedRide = async (req, res, next) => {
  //   const user = req.user;
  //   console.log(user);
  try {
    let { userId, rideId, status } = req.body;
    if (!userId || !rideId) return next(new AppErr("Please Provide all details"), 200);

    const bookedRide = await Ride.create({
      user: userId,
      ride: rideId,
      status: status,
    });

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
exports.updateBookedRide = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { rideId, status } = req.body;
  if (!rideId) return next(new AppErr("Pelase Provide User Id"), 200);

  // // chake email present or mot
  // const data = await User.findOne({ "email.emailId": emailId });
  // if (data) return next(new AppErr("Account already exist please add new emailId"), 200);

  const updateRide = await User.findByIdAndUpdate(
    { ride: rideId },
    { status: status }
    // { ...req.body },
    // { runValidator: true, useFindAndModify: false, new: true }
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
  const { rideId } = req.body;
  if (!rideId) return next(new AppErr("Pelase Provide Ride Id"), 200);

  const rideDelete = await Ride.findOne({ ride: rideId });
  res.status(200).json({
    status: true,
    message: "Delete Ride Successfully By Ride Id",
    rideDelete,
  });
});
// delete booked ride
exports.deleteRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.body;
  if (!rideId) return next(new AppErr("Pelase Provide Ride Id"), 200);

  const rideDelete = await Ride.findByIdAndDelete({ ride: rideId });
  res.status(200).json({
    status: true,
    message: "Delete Ride Successfully By Ride Id",
    rideDelete,
  });
});
