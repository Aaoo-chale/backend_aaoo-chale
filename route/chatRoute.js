const express = require("express");
const router = express.Router();
const userAuthController = require("../controller/userAuthController");
const chatController = require("../controller/chatController");

router.post("/createChat", chatController.createChat);
router.post("/getAllChat", chatController.getAllChat);
router.get("/getAllChatBySenderId", chatController.getAllChatBySenderId);
router.get("/getAllChatByReceiverId", chatController.getAllChatByReceiverId);
router.get("/getAllChatBySenderIdAndReceiverId", chatController.getAllChatBySenderIdAndReceiverId);
router.use(userAuthController.protect);
// router.get("/getUserChatHistory", chatController.getUserChatHistory);

module.exports = router;
