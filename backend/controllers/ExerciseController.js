const ExerciseLog = require("../models/ExerciseLog");

// ── GET /api/v1/exercise-logs ─────────────────────────────────────────────────
// Returns all logs for the logged-in user
// Optional: ?week=true → last 7 days only
const getExerciseLogs = async (req, res) => {
  try {
    const filter = { userId: req.userId };

    if (req.query.week === "true") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      filter.date = { $gte: sevenDaysAgo.toISOString().slice(0, 10) };
    }

    const logs = await ExerciseLog.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return res.json({ success: true, data: logs });
  } catch (err) {
    console.error("getExerciseLogs:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/v1/exercise-logs ────────────────────────────────────────────────
// Body: { activity, duration, intensity, date, calories, notes }
const createExerciseLog = async (req, res) => {
  try {
    const { activity, duration, intensity, date, calories, notes } = req.body;

    if (!activity || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: "activity and duration are required",
      });
    }

    const log = await ExerciseLog.create({
      userId:    req.userId,
      activity,
      duration:  Number(duration),
      intensity: intensity || "Moderate",
      date:      date || new Date().toISOString().slice(0, 10),
      calories:  Number(calories) || 0,
      notes:     notes || "",
    });

    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error("createExerciseLog:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/v1/exercise-logs/:id ─────────────────────────────────────────
// Delete a single log (only if it belongs to the logged-in user)
const deleteExerciseLog = async (req, res) => {
  try {
    const log = await ExerciseLog.findOneAndDelete({
      _id:    req.params.id,
      userId: req.userId,
    });

    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteExerciseLog:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getExerciseLogs, createExerciseLog, deleteExerciseLog };