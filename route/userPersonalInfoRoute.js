const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const userPerInfoController = require("../controller/userPerInfoController");
const router = express.Router();
router.get("/getUserPersoInfo", userPerInfoController.getUserPersoInfo);
router.use(userAuthController.protect); //below this protected routes
router.put("/updateUserPersoInfo", userPerInfoController.updateUserPersoInfo);

module.exports = router;
