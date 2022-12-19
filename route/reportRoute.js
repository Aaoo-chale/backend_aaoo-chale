const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");

router.post("/createReport", reportController.createReport);
router.post("/getReport", reportController.getReport);

module.exports = router;
