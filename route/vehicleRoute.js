const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const vehicleController = require("../controller/vehicleController");
const router = express.Router();

router.get("/getAllCarsByUserId", vehicleController.getAllCarsByUserId);
router.use(userAuthController.protect); //below this protected routes
router.post("/registerVehicle", vehicleController.registerVehicle);
// router.get("/getAllCars", vehicleController.getAllCars);

module.exports = router;
