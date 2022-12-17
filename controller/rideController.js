const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");
const moment = require("moment");

exports.createRide = catchAsync(async (req, res, next) => {
  const {
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
    stopCityLat: stopCityLat,
    stopCityLong: stopCityLong,
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

// exports.searchJobs = catchAsync(async (req, res, next) => {
//   const user = req?.user;
//   // const {}
//   let queryStr = req.query;
//   let mongoObject = {};
//   // if (queryStr.jobType) {
//   //   mongoObject["jobType"] = {
//   //     $regex: queryStr.jobType,
//   //     $options: "ixsm",
//   //   };
//   // }
//   if (queryStr.location) {
//     // if (queryStr.jobDesignation) {
//     //   if (mongoObject["$and"]) {
//     //     mongoObject["$and"] = [
//     //       ...mongoObject["$and"],
//     //       {
//     //         jobDesignation: {
//     //           $regex: queryStr.jobDesignation,
//     //           $options: "ixsm",
//     //         },
//     //       },
//     //     ];
//     //   } else {
//     //     mongoObject["$and"] = [
//     //       {
//     //         jobDesignation: {
//     //           $regex: queryStr.jobDesignation,
//     //           $options: "ixsm",
//     //         },
//     //       },
//     //     ];
//     //   }
//     // }
//     if (queryStr.location) {
//       if (mongoObject["$or"]) {
//         mongoObject["$or"] = [
//           ...mongoObject["$or"],
//           {
//             pickUpLocation: {
//               $regex: queryStr.location,
//               $options: "ixsm",
//             },
//           },
//           {
//             dropLocation: {
//               $regex: queryStr.location,
//               $options: "ixsm",
//             },
//           },
//           {
//             stopCity: {
//               $regex: queryStr.location,
//               $options: "ixsm",
//             },
//           },
//         ];
//       } else {
//         mongoObject["$or"] = [
//           {
//             pickUpLocation: {
//               $regex: queryStr.location,
//               $options: "ixsm",
//             },
//           },
//           {
//             dropLocation: {
//               $regex: queryStr.location,
//               $options: "ixsm",
//             },
//           },
//           {
//             stopCity: {
//               $regex: queryStr.location,
//               $options: "ixsm",
//             },
//           },
//         ];
//       }
//     }
//   }
//   if (queryStr.seatCount) {
//     mongoObject["$and"] = [
//       { passengerCount: { $gte: queryStr.seatCount } },
//       // { "salaryRange.toSalary": { $lte: queryStr.toSalary } },
//     ];
//   }
//   // if (queryStr.fromExperience && queryStr.toExperience) {
//   //   let salaryRange = [];
//   //   if (mongoObject["$and"]) {
//   //     salaryRange = mongoObject["$and"];
//   //   }
//   //   mongoObject["$and"] = [
//   //     ...salaryRange,
//   //     { "requiredExperience.fromExperience": { $gte: queryStr.fromExperience } },
//   //     { "requiredExperience.toExperience": { $lte: queryStr.toExperience } },
//   //   ];
//   // }

//   const searchJobs = await Ride.find({ $and: [mongoObject] });
//   res.status(201).json({
//     success: true,
//     result: searchJobs.length,
//     searchJobs,
//   });
// });

// case 'Search_Data':
// 					if(empty($this->input->post('user_id')))
// 					{
// 						$output['msg'] = 'User ID is required';
// 					}
// 					else
// 					{
// 						$user_id=$this->input->post('user_id');
// 						$tripdateinput=$this->input->post('tripdate');
// 						$search_passenger=$this->input->post('count_passenger');
// 						$pick_up_latitude= $this->input->post('pick_up_latitude');
// 						$pick_up_longitude = $this->input->post('pick_up_longitude');
// 						$drop_up_latitude = $this->input->post('drop_up_latitude');
// 						$drop_up_longitude = $this->input->post('drop_up_longitude');

// 						$result=$this->db->query("select * from `creat_trip` where `user_id`!='$user_id' AND available_seet>='$search_passenger' AND `status`='true'");
// 						if($result->num_rows())
// 						{
// 							$i=0;
// 							foreach ($result->result_array() as $row)
// 							{
//                                 $pickup_latitude=$row['pickup_latitude'];
// 								$pickup_longitude=$row['pickup_longitude'];
// 								$dropup_latitude=$row['dropup_latitude'];
// 								$dropup_longitude=$row['dropup_longitude'];
// 								$total_passenger=$row['count_passenger'];
// 								$available_seet=$row['available_seet'];
// 								$driver_id=$row['user_id'];

// 								$value=$this->db->query("select * from `users` where id='$driver_id'")->row();
// 								$value1=$this->db->query("select * from `my_preference` where user_id='$driver_id'")->row();
// 								$km = $this->getDistanceWithoutGMapKey($pickup_latitude,$pickup_longitude,$pick_up_latitude, $pick_up_longitude);
// 								$km2 = $this->getDistanceWithoutGMapKey($dropup_latitude, $dropup_longitude, $drop_up_latitude, $drop_up_longitude);
// 								$km1= intval($km);
// 								$km3= intval($km2);
// 								if($km1 <= 60)
// 								{
// 									if($km3 <=60)
// 									{
// 										$trip_date=$row['tripdate'];
// 										$trip_date1=strtotime($trip_date);
// 										$tripdateinput1=strtotime($tripdateinput);
// 									    $date = strtotime("+7 day", $tripdateinput1);
// 										if($tripdateinput1<=$trip_date1  && $trip_date1<$date)
// 										{
// 									        $per_person_price=$row['price'];
//                                             $Total_prise=(int)$per_person_price*(int)$search_passenger;
// 											$Total_prise=$Total_prise - ($Total_prise % 5);
// 									        $total_Booked_huaa_seat=$total_passenger-$available_seet;
// 									        $row['seat_booking_count']=$total_Booked_huaa_seat;
// 								            $row['seat_empty_count']=$available_seet;
// 											$row['Pic_Url']='https://easygo.digitalcredits.in/uploads/document/';
// 											$row['driver_name']=$value->first_name;
// 											$row['driver_pic']=$value->profilepic;
// 											$row['verified']=$value->is_verified;
// 											$row['singing']=$value1->singing;
// 											$row['smoking']=$value1->smoking;
// 											$row['pet']=$value1->pet;
// 											$row['Total_Price_of_Trip']=$Total_prise;
// 											$data[]=$row;
// 											$output['res']='success';
// 											$output['msg']='Trip Found';
// 											$output['data']=$data;
// 										}
// 									}
// 								}
// 							}
// 							if($output['res']!='success')
// 							{
// 								$output['res']='error';
// 								$output['msg']='Trip Not Found';
// 							}
// 						}
// 						else
// 						{
// 							$output['msg']="No Record Found";
// 						}
// 					}
// 					break;

// public	function getDistanceWithoutGMapKey($lat1, $long1, $lat2, $long2)
// 		{
// 			if (($lat1 == $lat2) && ($long1 == $long2))
// 			{
// 				return 0;
// 			}
// 			else
// 			{
// 				$theta = ((float)$long1 -  (float)$long2);
// 				// if($theta<0){
// 				// $theta = abs($theta);
// 				// }
// 				$dist = (sin(deg2rad((float)$lat1)) * sin(deg2rad((float)$lat2))) +  ((cos(deg2rad((float)$lat1)) * cos(deg2rad((float)$lat2))) * cos(deg2rad((float)$theta)));
// 				$dist = acos($dist);
// 				$dist = rad2deg($dist);
// 				$miles = $dist * 60 * 1.1515;
// 				return $miles * 1.609;
// 			}
// 		}
// exports.getNearByUsers = (req, res, next) => {
//   // res.send({ response: "I am alive" }).status(200);
//   UserLocation.ensureIndexes({ location: "2dsphere" });
//   var user = req.body.id;
//   // console.log(req.body)
//   let number = []
//   const data = ({ location } = req.body);
//   var latitude = parseFloat(data.latitude); // latitude comes through as string from url params, so it's converted to a float
//   var longitude = parseFloat(data.longitude);
//   UserLocation.find(
//     {
//       $and: [
//         { userId: { $ne: user } },
//         {
//           location: {
//             $near: {
//               $geometry: {
//                 type: "Point",
//                 coordinates: [latitude, longitude],
//               },
//               $maxDistance: 250 * 100,
//             },
//           },
//         },
//       ],
//     },
//     function (err, locations) {
//       if (err) {
//         res.send(err);
//       } else {
//         const gettedUsers = []
//         req.body.help.map((help) => {
//           locations.map((user) => {
//             if (user.userId.userType.name === 'Service Provider') {
//               if (user.userId.typeOfServices) {
//                 user.userId.typeOfServices.map((services) => {
//                   if (services === help) {
//                     gettedUsers.push(user)
//                   }
//                 })
//               }
//             }
//             else {
//               if (user.userId.userType.name === "Driver") {
//                 req.body.help.map((item) => {
//                   if (item == 'DRIVER') {
//                     gettedUsers.push(user)
//                   }
//                 })
//               }
//             }
//           })
//         })
//         if (gettedUsers) {
//           gettedUsers.map((users) => {
//             sendPushNotification1(gettedUsers, "Someone need Help", res.firstName + ' ' + res.lastName + ' Need Help')
//           })
//         }
//         // locations.map((item) => {
//         //   let contactNo = `+91` + item.userId.mobileNo
//         //   number.push(contactNo)
//         // })
//         // if (number) {
//         //   number.map(async (item) => {
//         //     await sendTextMessage(item)
//         //   })
//         // }
//         return res.status(200).json(gettedUsers);
//       }
//     }
//   )
//     .populate("groupId")
//     .populate("userId")
//     .populate({
//       path: "userId",
//       populate: {
//         path: "userType",
//       },
//     });
// };

exports.searchJobs = async (req, res, next) => {
  const { tripDate, peopleCount, pick_upLat, pick_Long, drop_Lat, drop_Long } = req.body;
  const result = await Ride.find({
    $and: [{ passengerCount: { $gte: peopleCount } }, { tripDate: tripDate }, { status: { $ne: false } }],
  }).populate({
    path: "userId",
    select: "chattiness music smoking pets",
    model: "User",
  });

  // [result].forEach (->result_array() as $row)
  // const pickup_latitude = result.pickupLat;
  // console.log("pickup_latitude", pickup_latitude);
  // const pickup_longitude = result.pickLong;
  // const dropup_latitude = result.dropLat;
  // const dropup_longitude = result.dropLong;
  // const total_passenger = result.passengerCount;
  // find user
  // const user = await User.findOne({ userId: userId });
  // console.log(user, "user");
  // const userOb = {
  //   chattiness: user.chattiness,
  //   music: user.music,
  //   smoking: user.smoking,
  //   pets: user.pets,
  // };

  // const km = distanceCount(pickup_latitude, pickup_longitude, pick_upLat, pick_Long);

  // const km1 = distanceCount(dropup_latitude, dropup_longitude, drop_Lat, drop_Long);

  // if (km <= 60) {
  //   if (km1 <= 60) {
  //     const trip_date = new Date(tripDate);
  //     // const tripdateinput1 = new Date(tripdateinput);
  //     const date = tripdateinput1;
  //     if (trip_date <= date) {
  //       const per_person_price = result.tripPrise;
  //       let totalPrise = per_person_price * passengerCount;
  //       totalPrise = totalPrise - (totalPrise % 5);
  //       const total_Booked_huaa_seat = total_passenger - searchCount;
  //       console.log((result.backSeatEmpty = searchCount));
  //       console.log((result.passengerCount = total_Booked_huaa_seat));
  //       result.tripPrise = totalPrise;
  //       var data = await result.save();
  //     }
  //   }
  // }
  res.status(200).json({
    success: true,
    length: result.length,
    result,
  });
};

// exports.getNearByUsers = (req, res, next) => {
//   // res.send({ response: "I am alive" }).status(200);
//   UserLocation.ensureIndexes({ location: "2dsphere" });
//   var user = req.body.id;
//   // console.log(req.body)
//   let number = [];
//   const data = ({ location } = req.body);
//   var latitude = parseFloat(data.latitude); // latitude comes through as string from url params, so it's converted to a float
//   var longitude = parseFloat(data.longitude);
//   UserLocation.find(
//     {
//       $and: [
//         { userId: { $ne: user } },
//         {
//           location: {
//             $near: {
//               $geometry: {
//                 type: "Point",
//                 coordinates: [latitude, longitude],
//               },
//               $maxDistance: 250 * 100,
//             },
//           },
//         },
//       ],
//     },
//     function (err, locations) {
//       if (err) {
//         res.send(err);
//       } else {
//         const gettedUsers = [];
//         req.body.help.map((help) => {
//           locations.map((user) => {
//             if (user.userId.userType.name === "Service Provider") {
//               if (user.userId.typeOfServices) {
//                 user.userId.typeOfServices.map((services) => {
//                   if (services === help) {
//                     gettedUsers.push(user);
//                   }
//                 });
//               }
//             } else {
//               if (user.userId.userType.name === "Driver") {
//                 req.body.help.map((item) => {
//                   if (item == "DRIVER") {
//                     gettedUsers.push(user);
//                   }
//                 });
//               }
//             }
//           });
//         });
//         if (gettedUsers) {
//           gettedUsers.map((users) => {
//             sendPushNotification1(gettedUsers, "Someone need Help", res.firstName + " " + res.lastName + " Need Help");
//           });
//         }
//         // locations.map((item) => {
//         //   let contactNo = `+91` + item.userId.mobileNo
//         //   number.push(contactNo)
//         // })
//         // if (number) {
//         //   number.map(async (item) => {
//         //     await sendTextMessage(item)
//         //   })
//         // }
//         return res.status(200).json(gettedUsers);
//       }
//     }
//   )
//     .populate("groupId")
//     .populate("userId")
//     .populate({
//       path: "userId",
//       populate: {
//         path: "userType",
//       },
//     });
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
