const express  = require("express");
const router   = express.Router();
const protect  = require("../middleware/authMiddleware");
const {
  getExerciseLogs,
  createExerciseLog,
  deleteExerciseLog,
} = require("../controllers/ExerciseController");

router.get(    "/",    protect, getExerciseLogs);
router.post(   "/",    protect, createExerciseLog);
router.delete( "/:id", protect, deleteExerciseLog);

module.exports = router;