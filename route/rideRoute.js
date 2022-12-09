const express = require("express");
const router = express.Router();
const rideController = require("../controller/rideController");

router.post("/createRide", rideController.createRide);
router.post("/getRide", rideController.getRide);
router.delete("/deleteRide", rideController.deleteRide);
router.post("/countDistance", rideController.countDistance);

module.exports = router;
