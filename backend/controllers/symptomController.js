const SymptomLog = require("../models/SymptomLog");

// ── GET /api/v1/symptom-logs ──────────────────────────────────────────────────
// Returns all symptom logs for the logged-in user, newest first
const getSymptomLogs = async (req, res) => {
  try {
    const logs = await SymptomLog.find({ userId: req.userId })
      .sort({ date: -1 })
      .lean();

    return res.json({ success: true, data: logs });
  } catch (err) {
    console.error("getSymptomLogs:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/v1/symptom-logs ─────────────────────────────────────────────────
// Upserts today's log — one document per user per day
// Body: { symptoms: [{ name, severity }], notes }
const createSymptomLog = async (req, res) => {
  try {
    const { symptoms, notes } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "symptoms array is required and must not be empty",
      });
    }

    // Validate severity values
    for (const s of symptoms) {
      if (!s.name || s.severity === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each symptom must have a name and severity (0–3)",
        });
      }
      if (s.severity < 0 || s.severity > 3) {
        return res.status(400).json({
          success: false,
          message: `Invalid severity "${s.severity}" — must be 0, 1, 2, or 3`,
        });
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    // Upsert: replaces symptoms + notes for today's entry
    const log = await SymptomLog.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $set: { symptoms, notes: notes || "" } },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error("createSymptomLog:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/v1/symptom-logs/:id ──────────────────────────────────────────
// Delete a symptom log by ID (only if it belongs to the logged-in user)
const deleteSymptomLog = async (req, res) => {
  try {
    const log = await SymptomLog.findOneAndDelete({
      _id:    req.params.id,
      userId: req.userId,
    });

    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteSymptomLog:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getSymptomLogs, createSymptomLog, deleteSymptomLog };