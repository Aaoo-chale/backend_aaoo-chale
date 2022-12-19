const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");

router.post("/createReport", reportController.createReport);
router.get("/getReport", reportController.getReport);

module.exports = router;
