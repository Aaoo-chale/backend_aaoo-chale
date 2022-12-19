const express = require("express");
const router = express.Router();
// const userAuthController = require("../controller/userAuthController");
const rideBookedController = require("../controller/rideBookController");

router.post("/bookedRide", rideBookedController.bookedRide);
router.put("/cancleBookedRide", rideBookedController.cancleBookedRide);
router.post("/getBookedRide", rideBookedController.getBookedRide);
router.delete("/deleteRide", rideBookedController.deleteRide);

module.exports = router;
