const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
const BookedRide = require("../model/rideBookingModel");
const notificationController = require("../notification/notificationController");
const { findOne } = require("../model/userModel");

// const moment = require("moment");

////////////
const Token = require("../model/fireBaseSchema");
const firebase = require("../notification/firebase");

////

const GetToken = async (userId) => {
  const list = await Token.find({ user_id: userId });

  if (list.length > 0) {
    return list[0].token;
  } else {
    var token = "";
    return token;
  }
};

exports.bookedRide = async (req, res, next) => {
  //   const user = req.user;
  //   console.log(user);
  try {
    // add receiver
    const { userId, receiver, rideId, status, message } = req.body;
    if (!userId || !receiver || !rideId || !status || !message)
      return next(new AppErr("Please Provide all details"), 200);
    const approval = await Ride.findOne({ _id: rideId });
    console.log(approval.rideApproval, "approval");

    if (approval.rideApproval == "No") {
      const data = await notificationController.postNotification(
        userId,
        receiver,
        "Booking Instant Approval",
        "You have received a new passenger from Aaoo Chale. Click here to know the more details."
      );

      //   if (receiver) {
      //     // console.log("okkkkkkkk");
      //     var content = {
      //       title: "You have new Notification please chake...",
      //       body: "You have received a new passenger from Aaoo Chale. Click here to know the more details.",
      //       imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
      //     };
      //     const key = await GetToken(receiver);
      //     console.log(key, "key");

      //     if (key != "") {
      //       console.log("okkkkkkkkkkkkkkkk");
      //       var firebaseres = await firebase.sendNotification(key, content);
      //     }
      //   }
      //   res.status(200).json({
      //     status: true,
      //     message: "Not Booked Ride Because rideApproval is No",
      //   });
      // } else {
      const bookedRide = await BookedRide.create({
        user: userId,
        receiver: receiver,
        ride: rideId,
        message: message,
        status: status,
      });
      await notificationController.postNotification(
        userId,
        receiver,
        "Booking Approval",
        "You have received a new passenger request from Aaoo Chale. Click here to approve the passenger"
      );

      if (receiver) {
        // console.log("okkkkkkkk");
        var content = {
          title: "You have new Notification please chake...",
          body: "You have received a new passenger request from Aaoo Chale. Click here to approve the passenger.",
          imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
        };
        const key = await GetToken(receiver);
        console.log(key, "key");

        if (key != "") {
          console.log("okkkkkkkkkkkkkkkk");
          var firebaseres = await firebase.sendNotification(key, content);
        }
      }

      res.status(200).json({
        status: true,
        message: "Booked Ride Succussefully",
        data: {
          bookedRide,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// update booked ride
exports.cancleBookedRide = catchAsync(async (req, res, next) => {
  // add sender id and receiver id
  const { id, sender, receiver, status } = req.body;

  if (!id || !status) return next(new AppErr("Pelase Provide User Id"), 200);
  const updateRide = await BookedRide.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  // save data
  await updateRide.save();
  await notificationController.postNotification(
    sender,
    receiver,
    "cancleBookedRide",
    "User Cancle BookedRide Ride...."
  );

  /// firebase
  if (receiver) {
    // console.log("okkkkkkkk");
    var content = {
      title: "You have new Notification please chake...",
      body: "User Cancle BookedRide Ride.....",
      imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
    };
    const key = await GetToken(receiver);
    console.log(key, "key");

    if (key != "") {
      // console.log("okkkkkkkkkkkkkkkk");
      var firebaseres = await firebase.sendNotification(key, content);
    }
  }

  res.status(200).json({
    status: true,
    data: {
      message: "User Cancle Booked Ride Successfully",
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

  const bookedPassenger = await BookedRide.find({ $and: [{ ride: rideId }, { status: "Booked" }] })
    .select("-__v")
    .populate({
      path: "user",
      select: "-email -mobile -createdOn -bio -DOB -ride -__v",
      model: "User",
    })
    .populate({
      path: "ride",
      select: "-_id -__v",
      model: "Ride",
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
