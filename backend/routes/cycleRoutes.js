const express = require("express");
const router = express.Router();
const {
  logCycle,
  getCycleHistory,
  predictNextPeriod,
  deleteCycle
} = require("../controllers/cycleController");
const protect = require("../middleware/authMiddleware");

router.post("/log", protect, logCycle);
router.get("/history", protect, getCycleHistory);
router.get("/predict", protect, predictNextPeriod);
router.delete("/:id", protect, deleteCycle);

module.exports = router;