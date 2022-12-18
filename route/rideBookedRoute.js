const express = require("express");
const router = express.Router();
// const userAuthController = require("../controller/userAuthController");
const rideBookedController = require("../controller/rideBookController");

router.post("/bookedRide", rideBookedController.bookedRide);
router.put("/updateBookedRide", rideBookedController.updateBookedRide);
router.get("/getBookedRide", rideBookedController.getBookedRide);
router.delete("/deleteRide", rideBookedController.deleteRide);

module.exports = router;
