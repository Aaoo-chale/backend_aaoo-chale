const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require("../model/userModel");
const Vehicle = require("../model/vehicleModel");
const Chat = require("../model/chatModel");
const Rating = require("../model/ratingModel");
require("dotenv").config();

exports.createRating = async (req, res, next) => {
  try {
    const { userId, rideId, message, rating } = req.body;
    const createRating = await Rating.create({
      userId: userId,
      rideId: rideId,
      message: message,
      rating: rating,
    });
    res.status(200).json({
      status: true,
      message: "Create Rating Succussefully",
      createRating,
    });
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
  const sum = [];
  const data = getRating.map((item) => {
    sum.push(item.rating);
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
    message: "Get Rating Successfully By uerId",
    ratingAverage,
  });
});
