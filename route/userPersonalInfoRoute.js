const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const userPerInfoController = require("../controller/userPerInfoController");
const router = express.Router();
router.use(userAuthController.protect); //below this protected routes
router.post("/addUserPersoInfo", userPerInfoController.addUserPersoInfo);
router.get("/getUserPersoInfo", userPerInfoController.getUserPersoInfo);

module.exports = router;
