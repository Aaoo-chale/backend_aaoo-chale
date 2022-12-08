const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const vehicleController = require("../controller/vehicleController");
const router = express.Router();

router.post("/getAllCarsByUserId", vehicleController.getAllCarsByUserId);
router.post("/getVehicleById", vehicleController.getVehicleById);
router.post("/uploadVehicle", vehicleController.uploadVehicle);
router.use(userAuthController.protect); //below this protected routes//
router.post("/registerVehicle", vehicleController.registerVehicle);
router.post("/getVehicleimage", vehicleController.getVehicleimage);

module.exports = router;
