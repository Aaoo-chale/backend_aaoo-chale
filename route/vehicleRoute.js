const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const vehicleController = require("../controller/vehicleController");
const router = express.Router();

router.post("/getAllCarsByUserId", vehicleController.getAllCarsByUserId);
router.post("/getVehicleById", vehicleController.getVehicleById);
router.use(userAuthController.protect); //below this protected routes//
router.post("/registerVehicle", vehicleController.registerVehicle);

module.exports = router;
