const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
const moment = require("moment");
const mongoose = require("mongoose");
// const mongoDb = require("mongoDb");

exports.createRide = catchAsync(async (req, res, next) => {
  const {
    pickUpLocation,
    pickupLat,
    pickLong,
    dropLocation,
    dropLat,
    dropLong,
    stopCity,
    tripDate,
    tripTime,
    totalDistance,
    totalTime,
    backSeatEmpty,
    passengerCount,
    rideApproval,
    tripPrise,
    extraMessage,
    select_route,
    rideStatus,
    vehicleSelect,
    userId,
  } = req.body;
  const resisterRide = await Ride.create({
    pickUpLocation: pickUpLocation,
    pickupLat: pickupLat,
    pickLong: pickLong,
    dropLocation: dropLocation,
    dropLat: dropLat,
    dropLong: dropLong,
    stopCity: stopCity,
    tripDate: tripDate,
    tripTime: tripTime,
    totalDistance: totalDistance,
    totalTime: totalTime,
    backSeatEmpty: backSeatEmpty,
    passengerCount: passengerCount,
    rideApproval: rideApproval,
    tripPrise: tripPrise,
    extraMessage: extraMessage,
    select_route: select_route,
    rideStatus: rideStatus,
    vehicleSelect: vehicleSelect,
    userId: userId,
  });
  res.status(200).json({
    status: true,
    data: {
      message: "Create Ride Successfully",
      resisterRide,
    },
  });
});

// get Ride

exports.getRide = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide Ride Id"), 200);

  const ride = await Ride.findById({ _id: id });
  res.status(200).json({
    status: true,
    data: {
      message: "Get Ride Successfully",
      ride,
    },
  });
});

// get ride by user Id
exports.getRideByUserId = async (req, res, next) => {
  const { id } = req.body;
  if (!id)
    ({
      status: false,
      data: {
        message: "Please Provide userId",
      },
    });

  const ride = await Ride.find({ userId: id });
  res.status(200).json({
    status: true,
    data: {
      message: "Get Ride Successfully By user Id",
      ride,
    },
  });
};

// TOTAL DISTANCE COUNT FUNCTION
function distanceCount(latitude1, longitude1, latitude2, longitude2, units) {
  var p = 0.017453292519943295; //This is  Math.PI / 180
  var c = Math.cos;
  var a =
    0.5 -
    c((latitude2 - latitude1) * p) / 2 +
    (c(latitude1 * p) * c(latitude2 * p) * (1 - c((longitude2 - longitude1) * p))) / 2;
  var R = 6371; //  Earth distance in km so it will return the distance in km
  var dist = 2 * R * Math.asin(Math.sqrt(a));
  // console.log("Distance Between London And New York is", dist, "KM");
  return dist;
}

// console.log(distanceCount(20.99541, 79.9428, 21.14691, 79.03129));

// DISTANCE COUNT API
exports.countDistance = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide Ride Id"), 200);

  const data = await Ride.findOne({ _id: id });
  const distance = distanceCount(data.pickupLat, data.pickLong, data.dropLat, data.dropLong);
  res.status(200).json({
    status: true,
    data: {
      message: "Count Distance In Km",
      distance,
    },
  });
});

// delete vehicle
exports.deleteRide = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide Ride Id"), 200);

  const deleteRide = await Ride.findByIdAndDelete({ _id: id });
  res.status(200).json({
    status: true,
    message: "Delete Ride Successfully By Ride Id",
    deleteRide,
  });
});

// nikhil search api
// exports.searchJobs = async (req, res, next) => {
//   const { tripDate, peopleCount, pick_upLat, pick_Long, drop_Lat, drop_Long } = req.body;
//   const result = await Ride.find({
//     $and: [{ passengerCount: { $gte: peopleCount } }, { tripDate: tripDate }],
//   }).populate({
//     path: "userId",
//     select: "firstName lastName profilePicture chattiness music smoking pets",
//     model: "User",
//   });

//   // [result].forEach (->result_array() as $row)
//   // const pickup_latitude = result.pickupLat;
//   // console.log("pickup_latitude", pickup_latitude);
//   // const pickup_longitude = result.pickLong;
//   // const dropup_latitude = result.dropLat;
//   // const dropup_longitude = result.dropLong;
//   // const total_passenger = result.passengerCount;
//   // find user
//   // const user = await User.findOne({ userId: userId });
//   // console.log(user, "user");
//   // const userOb = {
//   //   chattiness: user.chattiness,
//   //   music: user.music,
//   //   smoking: user.smoking,
//   //   pets: user.pets,
//   // };

//   // const km = distanceCount(pickup_latitude, pickup_longitude, pick_upLat, pick_Long);

//   // const km1 = distanceCount(dropup_latitude, dropup_longitude, drop_Lat, drop_Long);

//   // if (km <= 60) {
//   //   if (km1 <= 60) {
//   //     const trip_date = new Date(tripDate);
//   //     // const tripdateinput1 = new Date(tripdateinput);
//   //     const date = tripdateinput1;
//   //     if (trip_date <= date) {
//   //       const per_person_price = result.tripPrise;
//   //       let totalPrise = per_person_price * passengerCount;
//   //       totalPrise = totalPrise - (totalPrise % 5);
//   //       const total_Booked_huaa_seat = total_passenger - searchCount;
//   //       console.log((result.backSeatEmpty = searchCount));
//   //       console.log((result.passengerCount = total_Booked_huaa_seat));
//   //       result.tripPrise = totalPrise;
//   //       var data = await result.save();
//   //     }
//   //   }
//   // }
//   res.status(200).json({
//     success: true,
//     length: result.length,
//     result,
//   });
// };

exports.updateRideDetails = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const {
    id,
    pickUpLocation,
    pickupLat,
    pickLong,
    dropLocation,
    dropLat,
    dropLong,
    stopCity,
    stopCityLat,
    stopCityLong,
    tripDate,
    tripTime,
    totalDistance,
    totalTime,
    backSeatEmpty,
    passengerCount,
    rideApproval,
    tripPrise,
    extraMessage,
    select_route,
    rideStatus,
  } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // // chake email present or mot
  // const data = await User.findOne({ "email.emailId": emailId });
  // if (data) return next(new AppErr("Account already exist please add new emailId"), 200);

  const user = await Ride.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );

  await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Update Ride details Successfully",
      user,
    },
  });
});

// change satus
exports.changeRideStatus = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, rideStatus } = req.body;

  if (!id || !rideStatus) return next(new AppErr("Pelase Provide User Id"), 200);
  const changeRideStatus = await Ride.findByIdAndUpdate({ _id: id }, { rideStatus: rideStatus });
  // save data
  await changeRideStatus.save();
  res.status(200).json({
    status: true,
    data: {
      message: "change rideStatus  Successfully",
      changeRideStatus,
    },
  });
});

// const { ObjectId } = require("mongoDb");
exports.searchJobs = async (req, res) => {
  try {
    let { pickupLat, pickLong, dropLat, dropLong, userId, tripDate, passengerCount } = req.body;
    const distance = distanceCount(pickupLat, pickLong, dropLat, dropLong);
    const queryId = userId;
    const customDate = tripDate.toString().split("T")[0] + "T00:00:00.000+00:00";
    const result = await Ride.find({
      userId: { $ne: queryId },
      tripDate: { $eq: new Date(customDate) },
      passengerCount: { $gte: passengerCount },
    })
      .select(
        "tripDate passengerCount totalDistance pickUpLocation pickupLat pickLong dropLocation dropLat dropLong tripTime totalTime tripPrise"
      )
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture chattiness music smoking pets startRating",
        model: "User",
      });
    const R = 6371;
    let array = [];
    result.map((item, index) => {
      const dLat = (item.pickupLat - pickupLat) * (Math.PI / 180); // deg2rad below
      const dLon = (item.pickLong - pickLong) * (Math.PI / 180);
      const a =
        0.5 -
        Math.cos(dLat) / 2 +
        (Math.cos(pickupLat * (Math.PI / 180)) * Math.cos(item.pickupLat * (Math.PI / 180)) * (1 - Math.cos(dLon))) / 2;
      const distanc = R * 2 * Math.asin(Math.sqrt(a));
      if (distanc <= 70) {
        array.push(item);
      }
    });
    res.status(200).send({
      success: true,
      msg: "All details",
      length: array.length,
      result: array,
    });
  } catch (error) {
    console.log(error);
  }
};
