const express = require("express");
const path = require("path");
const userAuthController = require("../controller/userAuthController");
const userPerInfoController = require("../controller/userPerInfoController");
const router = express.Router();
router.post("/getUserPersoInfo", userPerInfoController.getUserPersoInfo);
router.use(userAuthController.protect); //below this protected routesaddUserPersoInfo
router.post("/addUserPersoInfo", userPerInfoController.addUserPersoInfo);
router.put("/updateUserPersoInfo", userPerInfoController.updateUserPersoInfo);
router.patch("/updateUserPreferences", userPerInfoController.updateUserPreferences);

module.exports = router;
