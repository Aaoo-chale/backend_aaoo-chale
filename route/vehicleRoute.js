const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const vehicleController = require("../controller/vehicleController");
const router = express.Router();
const upload = require("../controller/vehicleController");
router.post("/getAllCarsByUserId", vehicleController.getAllCarsByUserId);
router.post("/getVehicleById", vehicleController.getVehicleById);
router.use(userAuthController.protect); //below this protected routes//
router.post("/registerVehicle", vehicleController.registerVehicle);
router.post("/getVehicleimage", vehicleController.getVehicleimage);

router.post("/uploadImage", vehicleController.upload.array("vehicleimage", 4), vehicleController.uploadImage);

module.exports = router;
