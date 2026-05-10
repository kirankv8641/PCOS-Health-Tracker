const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { logSymptom, getSymptomHistory } = require("../controllers/symptomController");

router.post("/", protect, logSymptom);
router.get("/",  protect, getSymptomHistory);

module.exports = router;