const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware")

const {
  registerUser,
  loginUser,
  getMe,
  uploadProfile,
  getAllUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/upload-profile", protect, upload.single("profile"), uploadProfile);
router.get("/all", protect, getAllUsers);

module.exports = router;