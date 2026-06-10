const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  sendMessage,
  sendFileMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/send", sendMessage);

router.post(
  "/send-file",
  upload.single("file"),
  sendFileMessage
);

router.get(
  "/:senderId/:receiverId",
  getMessages
);

router.patch(
  "/read/:messageId",
  markAsRead
);

router.delete(
  "/:messageId",
  deleteMessage
);

module.exports = router;