const express = require("express");
const router = express.Router();
const ratingController = require("../controller/ratingController");
const notificationController = require("../notification/notificationController");

router.post("/createRating", ratingController.createRating);
router.post("/getRating", ratingController.getRating);
router.post("/giveOwnRatingOfUser", ratingController.giveOwnRatingOfUser);
router.post("/getRatingOtherUserSend", ratingController.getRatingOtherUserSend);
router.put("/replyDriver", ratingController.replyDriver);
router.post("/getRatingDetailsById", ratingController.getRatingDetailsById);
router.post("/getAverageRatingByUserId", ratingController.getAverageRatingByUserId);

module.exports = router;
