const express = require("express");
const router = express.Router();
const documentController = require("../controller/documentController");
// const upload = require("../controller/documentController");

router.post("/createApplicants", documentController.createApplicants);
router.post("/addDocument", documentController.upload);

// router.post("/getAllChat", chatController.getAllChat);
// router.get("/getAllChatBySenderId", chatController.getAllChatBySenderId);
// router.get("/getAllChatByReceiverId", chatController.getAllChatByReceiverId);
// router.get("/getAllChatBySenderIdAndReceiverId", chatController.getAllChatBySenderIdAndReceiverId);
// router.use(userAuthController.protect);
// router.get("/getUserChatHistory", chatController.getUserChatHistory);

module.exports = router;
