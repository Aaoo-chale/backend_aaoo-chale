const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
const Rating = require("../model/ratingModel");
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
// exports.searchJobs = async (req, res) => {
//   try {
//     let { pickupLat, pickLong, dropLat, dropLong, userId, tripDate, passengerCount, rideId } = req.body;
//     const distance = distanceCount(pickupLat, pickLong, dropLat, dropLong);
//     const queryId = userId;
//     const customDate = tripDate.toString().split("T")[0] + "T00:00:00.000+00:00";
//     // const rating = await Rating.findOne({ userId: userId }).select("startRating");
//     // console.log("Rating", rating);
//     const result = await Ride.find({
//       userId: { $ne: queryId },
//       tripDate: { $eq: new Date(customDate) },
//       passengerCount: { $gte: passengerCount },
//     })
//       .select(
//         "tripDate passengerCount totalDistance pickUpLocation pickupLat pickLong dropLocation dropLat dropLong tripTime totalTime tripPrise"
//       )
//       .populate({
//         path: "userId",
//         select: "firstName lastName profilePicture chattiness music smoking pets startRating",
//         model: "User",
//       });
//     const R = 6371;
//     let array = [];
//     result.map((item, index) => {
//       const dLat = (item.pickupLat - pickupLat) * (Math.PI / 180); // deg2rad below
//       const dLon = (item.pickLong - pickLong) * (Math.PI / 180);
//       /////
//       const droLat = (item.dropLat - dropLat) * (Math.PI / 180); // deg2rad below
//       const droLon = (item.dropLong - dropLong) * (Math.PI / 180);
//       const a =
//         0.5 -
//         Math.cos(dLat) / 2 +
//         (Math.cos(pickupLat * (Math.PI / 180)) * Math.cos(item.pickupLat * (Math.PI / 180)) * (1 - Math.cos(dLon))) / 2;

//       const distanc = R * 2 * Math.asin(Math.sqrt(a));
//       console.log("distanc", distanc);
//       console.log("aaaaaaaaaaaaa", a);
//       /////
//       const b =
//         0.5 -
//         Math.cos(droLat) / 2 +
//         (Math.cos(dropLat * (Math.PI / 180)) * Math.cos(item.dropLat * (Math.PI / 180)) * (1 - Math.cos(droLon))) / 2;
//       const distanc1 = R * 2 * Math.asin(Math.sqrt(b));
//       console.log("bbbbbbbbbbb", b);
//       console.log("distanc1", distanc1);

//       if (distanc <= 70) {
//         // array.push(item);
//         if (distanc1 <= 70) {
//           array.push(item);
//         }
//       }
//     });
//     console.log("array", array);
//     const obj = {
//       result,
//       Rating,
//     };
//     res.status(200).send({
//       success: true,
//       msg: "All details",
//       length: array.length,
//       obj,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.searchJobs = async (req, res) => {
//   try {
//     let { pickupLat, pickLong, dropLat, dropLong, userId, tripDate, passengerCount, rideId } = req.body;
//     const queryId = userId;
//     const customDate = tripDate;
//     // .toString().split("T")[0] + "T00:00:00.000+00:00";
//     // const rating = await Rating.findOne({ userId: userId }).select("startRating");
//     // console.log("Rating", rating);
//     const result = await Ride.find({
//       userId: { $ne: queryId },
//       tripDate: { $eq: new Date(customDate) },
//       passengerCount: { $gte: passengerCount },
//     })
//       .select(
//         "tripDate passengerCount totalDistance pickUpLocation pickupLat pickLong dropLocation dropLat dropLong tripTime totalTime tripPrise"
//       )
//       .populate({
//         path: "userId",
//         select: "firstName lastName profilePicture chattiness music smoking pets startRating",
//         model: "User",
//       });
//     const R = 6371;
//     let array = [];
//     let array1 = [];
//     let status = false;
//     let msg = " ";
//     result.map((item, index) => {
//       const dLat = (item.pickupLat - pickupLat) * (Math.PI / 180); // deg2rad below
//       const dLon = (item.pickLong - pickLong) * (Math.PI / 180);
//       const droLat = (item.dropLat - dropLat) * (Math.PI / 180); // deg2rad below
//       const droLon = (item.dropLong - dropLong) * (Math.PI / 180);
//       const a =
//         0.5 -
//         Math.cos(dLat) / 2 +
//         (Math.cos(pickupLat * (Math.PI / 180)) * Math.cos(item.pickupLat * (Math.PI / 180)) * (1 - Math.cos(dLon))) / 2;
//       const distanc = R * 2 * Math.asin(Math.sqrt(a));

//       console.log(a, "aaaaaaaaaaaaa");
//       console.log(distanc, "distanc");
//       const b =
//         0.5 -
//         Math.cos(droLat) / 2 +
//         (Math.cos(dropLat * (Math.PI / 180)) * Math.cos(item.dropLat * (Math.PI / 180)) * (1 - Math.cos(droLon))) / 2;
//       const distanc1 = R * 2 * Math.asin(Math.sqrt(b));
//       console.log(b, "bbbbbbbb");
//       console.log(distanc1, "distanc1");

//       console.log(item, "itemitem item");
//       if (distanc <= 90 && distanc1 <= 90) {
//         array.push(item);
//         array1.push("pickup", distanc, "dropoff", distanc1);
//         status = true;
//         msg = "Search Result Found";
//       } else {
//         array.push();
//         array1.push("pickup", distanc, "dropoff", distanc1);
//         status = false;
//         msg = "Search Result Not Found";
//       }
//     });
//     // const obj = {
//     //   array,
//     //   Rating,
//     // };
//     console.log(result, "result");
//     console.log(array, "array");
//     res.status(200).send({
//       success: status,
//       msg: msg,
//       both_distance: array1,
//       Search_Data: array,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

const rating = async function (userId) {
  if (userId) {
    const getRating = await Rating.find({ userId: userId });
    // console.log("getRating", getRating);
    const sum = [];
    const data = getRating.map((item) => {
      // console.log(item.startRating);
      sum.push(item.startRating);
    });
    let count = 0;
    let total = 0;

    while (count < sum.length) {
      total = total + sum[count];
      count += 1;
    }
    const ratingAverage = parseFloat(total / sum.length);
    // console.log(ratingAverage, "ratingAverage");
    return ratingAverage;
  }
};

// let ratings = rating("63b41b61e4629fdd814c6f00");
// const datas = ratings.then(function (result) {
//   const data = result;
//   // console.log(data, "data");
//   return data; // "Some User token"
// });
// console.log(datas, "ratings ratingsratings");
///
exports.searchJobs = async (req, res) => {
  try {
    let { pickupLat, pickLong, dropLat, dropLong, userId, tripDate, passengerCount, rideId } = req.body;
    // console.log(pickupLat, pickLong, dropLat, dropLong, userId, tripDate, passengerCount, "======================");
    const queryId = userId;
    const customDate = tripDate.toString().split("T")[0] + "T00:00:00.000+00:00";
    // const rating = await Rating.findOne({ userId: userId }).select("startRating");
    // console.log("Rating", rating);
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
    // console.log(result, "result");
    const R = 6371;
    let array = [];
    let array1 = [];
    var array2 = [];
    let status = false;
    let msg = " ";
    result.map((item, index) => {
      const dLat = (item.pickupLat - pickupLat) * (Math.PI / 180); // deg2rad below
      const dLon = (item.pickLong - pickLong) * (Math.PI / 180);
      const droLat = (item.dropLat - dropLat) * (Math.PI / 180); // deg2rad below
      const droLon = (item.dropLong - dropLong) * (Math.PI / 180);
      const a =
        0.5 -
        Math.cos(dLat) / 2 +
        (Math.cos(pickupLat * (Math.PI / 180)) * Math.cos(item.pickupLat * (Math.PI / 180)) * (1 - Math.cos(dLon))) / 2;
      const distanc = R * 2 * Math.asin(Math.sqrt(a));
      const b =
        0.5 -
        Math.cos(droLat) / 2 +
        (Math.cos(dropLat * (Math.PI / 180)) * Math.cos(item.dropLat * (Math.PI / 180)) * (1 - Math.cos(droLon))) / 2;
      const distanc1 = R * 2 * Math.asin(Math.sqrt(b));

      // ///////////////////
      // let ratings = rating(item.userId);
      // const datas = ratings.then(function (result) {
      //   const data = result;
      //   console.log(data, "data");
      //   return data; // "Some User token"
      // });
      // console.log(datas, "ratings");
      // // //////////
      if (distanc <= 90 && distanc1 <= 90) {
        let ratings = rating(item.userId); //  (item.userId);
        ratings.then(function (result) {
          const data = result;
          // if (data) {
          console.log(data);
          array2.push(data);
        });
        array.push(item);
        array1.push("pickup", distanc, "dropoff", distanc1);
        status = true;
        msg = "Search Result Found";
      } else {
        array.push();
        array1.push("pickup", distanc, "dropoff", distanc1);
        status = false;
        msg = "Search Result Not Found";
      }
    });
    console.log(array2, "ratingrating");
    // const obj = {
    //   array,
    //   Rating,
    // };
    res.status(200).send({
      success: status,
      msg: msg,
      both_distance: array1,
      Search_Data: array,
      rating: array2,
    });
  } catch (error) {
    console.log(error);
  }
};
