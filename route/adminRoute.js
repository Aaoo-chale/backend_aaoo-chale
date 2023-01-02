const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

router.post("/getAllUsers", adminController.getAllUsers);

module.exports = router;
