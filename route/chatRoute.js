const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");

router.post("/createChat", chatController.createChat);
router.get("/getAllChat", chatController.getAllChat);
router.get("/getAllChatBySenderId", chatController.getAllChatBySenderId);
router.get("/getAllChatByReceiverId", chatController.getAllChatByReceiverId);

router.get("/getAllChatBySenderIdAndReceiverId", chatController.getAllChatBySenderIdAndReceiverId);

module.exports = router;
