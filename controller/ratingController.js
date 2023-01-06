const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require("../model/userModel");
const Vehicle = require("../model/vehicleModel");
const Chat = require("../model/chatModel");
const Rating = require("../model/ratingModel");
const Notification = require("../model/notificationSchema");
const notificationController = require("../notification/notificationController");
const Token = require("../model/fireBaseSchema");
const firebase = require("../notification/firebase");
require("dotenv").config();

const GetToken = async (userId) => {
  const list = await Token.find({ user_id: userId });

  if (list.length > 0) {
    return list[0].token;
  } else {
    var token = "";
    return token;
  }
};

console.log(GetToken, "GetToken");

exports.createRating = async (req, res, next) => {
  try {
    const { userId, driverId, rideId, message, startRating } = req.body;
    console.log(req.body);
    const createRating = await Rating.create({
      userId: userId,
      driverId: driverId,
      rideId: rideId,
      message: message,
      startRating: startRating,
    });
    await notificationController.postNotification(userId, driverId, "Rating");

    /////////////
    // async function (err, data) {
    if (driverId) {
      // console.log("okkkkkkkk");
      var content = {
        title: "Hi You Get Successfully Rating.",
        body: message,
      };
      const key = await GetToken("63b41b54e4629fdd814c6ef9");
      console.log(key, "key");

      // if (key != "") {
      var firebaseres = await firebase.sendNotification(key, content);
      console.log(firebaseres, "firebaseres");
      // }
      //////////////
      res.status(200).json({
        status: true,
        message: "Create Rating Succussefully",
        createRating,
      });
    }
  } catch (error) {
    next(error);
  }
};

// // get getRating
// exports.getRating = catchAsync(async (req, res, next) => {
//   // const { rideId } = req.body;
//   // if (!rideId) return next(new AppErr("Pelase Provide userId"), 200);

//   // // db.products.aggregate({$group:{_id:'$productId',count:{$sum:1},avg:{$avg:'$noOfStars'}}},{$project:{_id:1,count:1,avg:{$round:['$avg',1]}}})
//   const getRating = await Rating.aggregate([{ $group: { _id: "$rideId", Total: { $avg: "$rating" } } }]);

//   console.log("abc", getRating);
//   res.status(200).json({
//     status: true,
//     message: "Get Rating Successfully By uerId",
//     getRating,
//   });
// });

exports.getRating = catchAsync(async (req, res, next) => {
  const { rideId } = req.body;
  if (!rideId) return next(new AppErr("Pelase Provide userId"), 200);
  const getRating = await Rating.find({ rideId: rideId });
  console.log("getRating", getRating);
  const sum = [];
  const data = getRating.map((item) => {
    console.log(item.startRating);
    sum.push(item.startRating);
  });
  let count = 0;
  let total = 0;

  while (count < sum.length) {
    total = total + sum[count];
    count += 1;
  }
  const ratingAverage = parseFloat(total / sum.length);
  res.status(200).json({
    status: true,
    message: "Get Rating Successfully By rideId",
    ratingAverage,
  });
});

///
exports.getAverageRatingByUserId = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppErr("Pelase Provide userId"), 200);
  const getRating = await Rating.find({ driverId: userId });

  const sum = [];
  const data = getRating.map((item) => {
    sum.push(item.startRating);
  });
  let count = 0;
  let total = 0;

  while (count < sum.length) {
    total = total + sum[count];
    count += 1;
  }
  const ratingAverage = parseFloat(total / sum.length);
  res.status(200).json({
    status: true,
    message: "Get Rating Successfully By userId",
    ratingAverage,
  });
});
// 1.Api for create rarting 2.Api for received rating 3.APi for given rating 4.Reply for rating only single reply

// api for given rating kisko mayne rating diya
exports.giveOwnRatingOfUser = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppErr("Pelase Provide userId"), 200);
  const givenRating = await Rating.find({ userId: userId })
    .populate({
      path: "driverId",
      select: "-email -mobile -createdOn -bio -DOB -ride -__v",
      model: "User",
    })
    .populate({
      path: "rideId",
      select: "-_id -__v",
      model: "Ride",
    });

  res.status(200).json({
    status: true,
    message: "Get Rating Successfully By userId",
    length: givenRating.length,
    givenRating,
  });
});

//kisne muze rating diya
exports.getRatingOtherUserSend = catchAsync(async (req, res, next) => {
  const { driverId } = req.body;
  if (!driverId) return next(new AppErr("Pelase Provide driverId"), 200);
  const riverGetRating = await Rating.find({ driverId: driverId })
    .populate({
      path: "userId",
      select: "-email -mobile -createdOn -bio -DOB -ride -__v",
      model: "User",
    })
    .populate({
      path: "rideId",
      select: "-_id -__v",
      model: "Ride",
    });
  console.log("riverGetRating", riverGetRating);

  res.status(200).json({
    status: true,
    message: "Get send Rating Successfully",
    length: riverGetRating.length,
    riverGetRating,
  });
});

// reply driver update
exports.replyDriver = catchAsync(async (req, res, next) => {
  const { id, sender, receiver, reply } = req.body;
  if (!id || !reply) return next(new AppErr("Pelase Provide id and reply"), 200);

  const replyDriver = await Rating.findByIdAndUpdate(
    { _id: id },
    { reply: reply },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  // save data
  console.log(replyDriver, "replyDriver");
  await replyDriver.save();
  await notificationController.postNotification(
    sender,
    receiver,
    "Message",
    "You have received a new message. Click here to reply"
  );
  res.status(200).json({
    status: true,
    data: {
      message: "Driver reply Successfully",
      replyDriver,
    },
  });
});

// get retails of rating id
exports.getRatingDetailsById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide id"), 200);
  const getRatingDetails = await Rating.findOne({ _id: id });
  res.status(200).json({
    status: true,
    message: "Get Rating getRatingDetails Successfully",
    getRatingDetails,
  });
});
