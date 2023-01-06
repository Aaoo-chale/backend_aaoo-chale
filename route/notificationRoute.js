const path = require("path");
const express = require("express");
const router = express.Router();
// const userAuthController = require(path.join(__dirname, "..", "..", "controller", "userAuthController"));
const notificationController = require("../notification/notificationController");
// router.use(userAuthController.protect);
// router.post("/postNotification", notificationController.postNotification);
router.post("/getAllNotifications", notificationController.getAllNotifications);
router.post("/getNotificationById", notificationController.getNotificationById);
router.delete("/deleteNotification", notificationController.deleteNotifications);
router.post("/getAllNotificationsBySelf", notificationController.getAllNotificationsBySelf);
router.post("/sendnotification", notificationController.sendnotification);

module.exports = router;
