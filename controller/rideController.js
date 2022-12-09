const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const Vehicle = require("../model/vehicleModel");
const Ride = require("../model/rideModel");

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

// search api
exports.searchJobs = catchAsync(async (req, res, next) => {
  // const user = req?.user;
  let queryStr = req.query;
  // let appliedJobs = [];
  let mongoObject = {};
  const { page, pageSize } = req.query;
  const skip = (page - 1) * pageSize;
  // if (user) {
  //   appliedJobs = (await CandidateJobs.find({ candidate: user._id }).select("job")).map((el) => {
  //     return el.job;
  //   });
  // }
  // const arr = [{ jobStatus: { $ne: "closed" } }, { jobStatus: { $ne: "stop" } }];
  // if (queryStr.jobType) {
  //   mongoObject["jobType"] = {
  //     $regex: queryStr.jobType,
  //     $options: "ixsm",
  //   };
  // }
  // //
  if (queryStr?.jobDesignation?.length >= 1 && queryStr?.jobLocation?.length >= 1) {
    const searchJobs = await JobPost.find({
      $and: [
        // { _id: { $nin: appliedJobs } },
        // {
        // $and: [
        // {
        //   jobDesignation: {
        //     $regex: queryStr.jobDesignation,
        //     $options: "ixsm",
        //   },
        // },
        {
          $or: [
            {
              "jobLocation.country": {
                $regex: queryStr.jobLocation,
                $options: "ixsm",
              },
            },
            {
              "jobLocation.state": {
                $regex: queryStr.jobLocation,
                $options: "ixsm",
              },
            },
            {
              "jobLocation.city": {
                $regex: queryStr.jobLocation,
                $options: "ixsm",
              },
            },
          ],
        },
        // ],
        // },
        // {
        //   $and: arr,
        // },
      ],
    })
      .skip(skip)
      .limit(pageSize)
      .populate("createdById")
      .lean();

    return res.status(201).json({
      success: true,
      result: searchJobs.length,
      searchJobs,
    });
  }
  //
  if (queryStr.jobLocation || queryStr.jobDesignation || queryStr.keySkills) {
    if (queryStr.jobDesignation) {
      if (mongoObject["$or"]) {
        mongoObject["$or"] = [
          ...mongoObject["$or"],
          {
            jobDesignation: {
              $regex: queryStr.jobDesignation,
              $options: "ixsm",
            },
          },
        ];
      } else {
        mongoObject["$or"] = [
          {
            jobDesignation: {
              $regex: queryStr.jobDesignation,
              $options: "ixsm",
            },
          },
        ];
      }
    }
    if (queryStr.keySkills) {
      let keySkillArray = queryStr.keySkills.split(/[ ,]+/);
      let rgxArray = keySkillArray.map((ele) => {
        var re = new RegExp(`^${ele} `, "i");
        return re;
      });

      if (mongoObject["$or"]) {
        mongoObject["$or"] = [
          ...mongoObject["$or"],
          {
            keySkills: {
              $in: rgxArray,
            },
          },
        ];
      } else {
        mongoObject["$or"] = [
          {
            keySkills: {
              $in: rgxArray,
            },
          },
        ];
      }
    }
    if (queryStr.jobLocation) {
      if (mongoObject["$or"]) {
        mongoObject["$or"] = [
          ...mongoObject["$or"],
          {
            "jobLocation.country": {
              $regex: queryStr.jobLocation,
              $options: "ixsm",
            },
          },
          {
            "jobLocation.state": {
              $regex: queryStr.jobLocation,
              $options: "ixsm",
            },
          },
          {
            "jobLocation.city": {
              $regex: queryStr.jobLocation,
              $options: "ixsm",
            },
          },
        ];
      } else {
        mongoObject["$or"] = [
          {
            "jobLocation.country": {
              $regex: queryStr.jobLocation,
              $options: "ixsm",
            },
          },
          {
            "jobLocation.state": {
              $regex: queryStr.jobLocation,
              $options: "ixsm",
            },
          },
          {
            "jobLocation.city": {
              $regex: queryStr.jobLocation,
              $options: "ixsm",
            },
          },
        ];
      }
    }
  }

  if (queryStr.fromSalary && queryStr.toSalary) {
    mongoObject["$and"] = [
      { "salaryRange.fromSalary": { $gte: queryStr.fromSalary } },
      { "salaryRange.toSalary": { $lte: queryStr.toSalary } },
    ];
  }

  if (queryStr.fromExperience && queryStr.toExperience) {
    let salaryRange = [];

    if (mongoObject["$and"]) {
      salaryRange = mongoObject["$and"];
    }

    mongoObject["$and"] = [
      ...salaryRange,
      { "requiredExperience.fromExperience": { $gte: queryStr.fromExperience } },
      { "requiredExperience.toExperience": { $lte: queryStr.toExperience } },
    ];
  }
  // console.dir(mongoObject);
  // if (user) arr.push({ "appliedCandidates.candidate": { $nin: [user._id] } });
  // console.log(mongoObject, arr);
  const searchJobs = await JobPost.find({
    $and: [
      { _id: { $nin: appliedJobs } },
      mongoObject,
      {
        $and: arr,
      },
    ],
  })
    .skip(skip)
    .limit(pageSize)
    .populate("createdById")
    .lean();

  res.status(201).json({
    success: true,
    result: searchJobs.length,
    searchJobs,
  });
});

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
