const express = require("express");
const router = express.Router();
const rideController = require("../controller/rideController");

router.post("/createRide", rideController.createRide);
router.post("/getRide", rideController.getRide);
router.delete("/deleteRide", rideController.deleteRide);
router.post("/countDistance", rideController.countDistance);
router.post("/searchJobs", rideController.searchJobs);
router.post("/getRideByUserId", rideController.getRideByUserId);

module.exports = router;
