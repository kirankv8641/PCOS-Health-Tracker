const DietLog = require("../models/DietLog");

// ── Helper: recalculate totals from sub-arrays ────────────────────────────────
function recalcTotals(doc) {
  doc.calories     = doc.meals.reduce((sum, m) => sum + (Number(m.cal) || 0), 0);
  doc.waterGlasses = doc.waterLogs.reduce((sum, w) => sum + (Number(w.glasses) || 0), 0);
  return doc;
}

// ── GET /api/v1/diet-logs ─────────────────────────────────────────────────────
// Returns all diet logs for the logged-in user, newest first
// Dashboard reads calories + waterGlasses from today's entry
const getDietLogs = async (req, res) => {
  try {
    const logs = await DietLog.find({ userId: req.userId })
      .sort({ date: -1 })
      .lean();

    return res.json({ success: true, data: logs });
  } catch (err) {
    console.error("getDietLogs:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── POST /api/v1/diet-logs ────────────────────────────────────────────────────
// Upserts the full diet document for a given day
// Body: { date?, meals[], waterLogs[], seedLogs[], teaLogs[] }
const createOrUpdateDietLog = async (req, res) => {
  try {
    const {
      date,
      meals      = [],
      waterLogs  = [],
      seedLogs   = [],
      teaLogs    = [],
    } = req.body;

    const targetDate   = date || new Date().toISOString().slice(0, 10);
    const calories     = meals.reduce((sum, m) => sum + (Number(m.cal) || 0), 0);
    const waterGlasses = waterLogs.reduce((sum, w) => sum + (Number(w.glasses) || 0), 0);

    const log = await DietLog.findOneAndUpdate(
      { userId: req.userId, date: targetDate },
      { $set: { meals, waterLogs, seedLogs, teaLogs, calories, waterGlasses } },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error("createOrUpdateDietLog:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── PATCH /api/v1/diet-logs/:date ────────────────────────────────────────────
// Appends a single item to one sub-array for a specific date
// Body: { type: "meal" | "water" | "seed" | "tea", item: { ...fields } }
// Used by the individual "+ Add" buttons in the Diet page
const addDietItem = async (req, res) => {
  try {
    const { type, item } = req.body;

    const fieldMap = {
      meal:  "meals",
      water: "waterLogs",
      seed:  "seedLogs",
      tea:   "teaLogs",
    };

    const field = fieldMap[type];

    if (!field || !item) {
      return res.status(400).json({
        success: false,
        message: `type must be one of: ${Object.keys(fieldMap).join(", ")}, and item is required`,
      });
    }

    const log = await DietLog.findOneAndUpdate(
      { userId: req.userId, date: req.params.date },
      { $push: { [field]: item } },
      { upsert: true, new: true, runValidators: true }
    );

    // Recompute totals after push
    recalcTotals(log);
    await log.save();

    return res.json({ success: true, data: log });
  } catch (err) {
    console.error("addDietItem:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/v1/diet-logs/:id ─────────────────────────────────────────────
// Delete an entire day's diet log by document _id
const deleteDietLog = async (req, res) => {
  try {
    const log = await DietLog.findOneAndDelete({
      _id:    req.params.id,
      userId: req.userId,
    });

    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteDietLog:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/v1/diet-logs/:date/item ──────────────────────────────────────
// Remove a single sub-item from a sub-array by its _id
// Body: { type: "meal" | "water" | "seed" | "tea", itemId: "..." }
const removeDietItem = async (req, res) => {
  try {
    const { type, itemId } = req.body;

    const fieldMap = {
      meal:  "meals",
      water: "waterLogs",
      seed:  "seedLogs",
      tea:   "teaLogs",
    };

    const field = fieldMap[type];

    if (!field || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Valid type and itemId are required",
      });
    }

    const log = await DietLog.findOneAndUpdate(
      { userId: req.userId, date: req.params.date },
      { $pull: { [field]: { _id: itemId } } },
      { new: true }
    );

    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    recalcTotals(log);
    await log.save();

    return res.json({ success: true, data: log });
  } catch (err) {
    console.error("removeDietItem:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDietLogs,
  createOrUpdateDietLog,
  addDietItem,
  deleteDietLog,
  removeDietItem,
};