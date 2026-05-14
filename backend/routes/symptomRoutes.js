const express    = require("express");
const router     = express.Router();
const protect    = require("../middleware/authMiddleware");
const {
  getSymptomLogs,
  createSymptomLog,
  deleteSymptomLog,
} = require("../controllers/symptomController");

router.get(    "/",    protect, getSymptomLogs);
router.post(   "/",    protect, createSymptomLog);
router.delete( "/:id", protect, deleteSymptomLog);

module.exports = router;