const express = require("express");
const router = express.Router();
const ratingController = require("../controller/ratingController");

router.post("/createRating", ratingController.createRating);
router.post("/getRating", ratingController.getRating);

module.exports = router;
