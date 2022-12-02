const path = require("path");
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");

// register car
exports.registerVehicle = async (req, res, next) => {
  const user = req.user;
  console.log(user._id);
  try {
    let { vehicleRegiNumb, carBrand, carModel, carType, carColor, manufacturYear, vehiclePic } = req.body;

    const vehicle = await Vehicle.create({
      vehicleRegiNumb,
      carBrand,
      carModel,
      carType,
      carColor,
      manufacturYear,
      vehiclePic,
      userId: user._id,
    });

    res.status(200).json({
      type: "success",
      message: "Vehicle Register Succussefully",
      data: {
        vehicle,
      },
    });
  } catch (error) {
    next(error);
  }
};

// // get all register car
// exports.getAllCars = async (req, res, next) => {
//   try {
//     const getAllCars = await Vehicle.find({});
//     res.status(200).json({
//       type: "success",
//       message: "Vehicle Register Succussefully",
//       getAllCars,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// get all cars of UserId
exports.getAllCarsByUserId = async (req, res, next) => {
  // const user = req.user;
  const { id } = req.query;
  try {
    const getAllCars = await Vehicle.find({ userId: id });
    res.status(200).json({
      type: "success",
      message: "Vehicle Register Succussefully",
      getAllCars,
    });
  } catch (error) {
    next(error);
  }
};
