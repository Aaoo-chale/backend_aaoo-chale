const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
// const Vehicle = require("../model/vehicleModel");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
require("dotenv").config();
const Vehicle = require("../model/vehicleModel");
const vehicleImage = require("../model/vehicleImageModel");

// register car
exports.registerVehicle = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  try {
    let { vehicleRegiNumb, carBrand, carModel, carType, carColor, manufacturYear, seatCount, colorCode } = req.body;

    const vehicle = await Vehicle.create({
      vehicleRegiNumb: vehicleRegiNumb,
      seatCount: seatCount,
      carBrand: carBrand,
      carModel: carModel,
      carType: carType,
      carColor: carColor,
      colorCode: colorCode,
      manufacturYear: manufacturYear,
      // vehiclePic,
      userId: user._id,
    });

    res.status(200).json({
      status: true,
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
  const { id } = req.body;
  try {
    const getAllCars = await Vehicle.find({ userId: id });
    console.log(getAllCars);
    res.status(200).json({
      status: true,
      message: "Get Vehicle successfully By user Id",
      getAllCars,
    });
  } catch (error) {
    next(error);
  }
};

// get Vehicle details by using vehicle ID
exports.getVehicleById = async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  try {
    const getCar = await Vehicle.find({ _id: id });
    console.log(getCar);
    res.status(200).json({
      status: true,
      message: "Get Vehicle successfully By Vehicle Id",
      getCar,
    });
  } catch (error) {
    next(error);
  }
};

// UPLOAD PROFILE PICTURE TO FS
// exports.uploadProfilePictureFS = (req, res, next) => {
//   const uploader = upload.single("profile-picture");
//   uploader(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return next(new AppErr(err.message, 500));
//     } else if (err) {
//       // An unknown error occurred when uploading.
//       return next(new AppErr(err.message, 500));
//     } else {
//       // manually throw errors if file is not presend
//       if (!req?.file) return next(new AppErr("Please Provide Required File To Upload Profile Picture", 400));
//       return next();
//     }
//   });
// };

// UPLOAD PROFILE PICTURE TO DB
// exports.uploadProfilePictureDB = catchAsync(async (req, res, next) => {
//   const user = await getUserBypass(req);
//   // set profile picture
//   const profilePictureLink = req?.file?.location;
//   user.profilePictureLink = profilePictureLink;
//   await user.save();
//   res.status(200).json({
//     status: "success",
//     data: {
//       doc: {
//         profilePictureLink,
//       },
//       message: "Profile Picture Updated Successfully",
//     },
//   });
// });

// // FETCH PROFILE PICTURE
// exports.getProfilePicture = catchAsync(async (req, res, next) => {
//   const user = await getUserBypass(req);
//   if (!user.profilePictureLink) return next(new AppErr("User Has No Profile Picture", 400));
//   res.status(200).json({
//     data: {
//       doc: {
//         profilePictureLink: user.profilePictureLink,
//       },
//     },
//   });
// });

// exports.getCandidateProfilePicture = catchAsync(async (req, res, next) => {
//   const { candidateId } = req.query;
//   if (!candidateId) return next(new AppErr("Please Provide Candidate Id", 400));
//   const user = await Candidate.findOne({ _id: candidateId });
//   if (!user.profilePictureLink)
//     return res.status(200).json({
//       status: "fail",
//       message: "User Does Not Have A Profile Picture",
//     });
//   res.status(200).json({
//     status: "success",
//     data: {
//       doc: {
//         profilePictureLink: user.profilePictureLink,
//       },
//     },
//   });
// });

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRETE_ACCESS_KEY,
  region: process.env.S3_BUCKET_RESION,
  // signatureVersion: "v4",
});

module.exports.upload = multer({
  // fileFilter,
  storage: multerS3({
    //acl: "public-read",
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}${file.originalname}`);
    },
  }),
});

exports.uploadImage = async (req, res) => {
  const [files] = req.files;
  const { id } = req.body;
  // console.log(files.location, "files");
  var data = await vehicleImage({
    vehicleimage: files.location,
    vehicleId: id,
  });

  console.log(data, "data");
  await data.save((err, feed) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    // res.json(feed);
    res.send(files);
  });
};
// aaoochale-vehicle bucketName
// const upload = () => {
//   multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: "aaoochale-vehicle",
//       metadata: function (req, file, cb) {
//         cb(null, { fileName: file.fieldname });
//       },
//       key: function (req, file, cb) {
//         cb(null, `image-${Date.now.toString()}jpeg`);
//       },
//     }),
//   });
// };

// const Storage = multer.diskStorage({
//   destination: "./uploads/uploadImage",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({
//   storage: Storage,
// }).single("image");

// exports.uploadVehicle = async (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const newImage = new vehicleImage({
//         // vehiclePic: req.file.filename,
//         name: req.body.name,
//         vehicleImage: req.file.filename,
//         // {
//         //   data: req.file.filename,
//         //   contentType: "image/jpg",
//         // },
//         vehicleId: req.body.vehicleId,
//       });
//       newImage
//         .save()
//         .then(() => res.send("successfully Image Upload"))
//         .catch((err) => console.log(err));
//     }
//   });
// };

// exports.uploadVehicle = async (req, res, next) => {
//   // console.log("uploadSingle");
//   let uploadSingle = await upload.single("image");
//   console.log(uploadSingle);
//   // uploadSingle(req, res, async (err) => {
//   //   console.log("ok");
//   //   if (err) return res.status(400).json({ success: false, message: err.message });
//   //   console.log(req.file);
//   //   vehicleImage.create({ vehicleimage: req?.file?.location });
//   //   res.status(200).json({ data: req.file });
//   // });
// };

/// get Vehicle Image
exports.getVehicleimage = async (req, res, next) => {
  const { id } = req.body;
  try {
    const vehiclePic = await vehicleImage.findOne({ vehicleId: id });
    res.status(200).json({
      status: true,
      message: "Get Vehicle Image successfully By Vehicle Id",
      vehiclePic,
    });
  } catch (error) {
    next(error);
  }
};

// delete vehicle
exports.deleteVehicle = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const vehicleDelete = await Vehicle.findByIdAndDelete({ _id: id });
  res.status(200).json({
    status: true,
    message: "Delete Vehicle Successfully By Vehicle Id",
    vehicleDelete,
  });
});
