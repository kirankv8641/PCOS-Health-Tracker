const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
  saveReminders,   
  getReminders    
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/delete", protect, deleteAccount);
router.get("/reminders", protect, getReminders);    
router.post("/reminders", protect, saveReminders);  
module.exports = router;