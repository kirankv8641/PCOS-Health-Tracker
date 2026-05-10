const SymptomLog = require("../models/symptomLog");

// POST /api/symptom-logs
exports.logSymptom = async (req, res) => {
  try {
    const { symptoms, notes } = req.body;  // only these two from frontend

    const symptomLog = await SymptomLog.create({
      user: req.user.id,
      symptoms,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Symptoms logged successfully",
      data: symptomLog
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/symptom-logs  — returns history formatted for frontend
exports.getSymptomHistory = async (req, res) => {
  try {
    const logs = await SymptomLog.find({ user: req.user.id }).sort({ date: -1 });

    // Format exactly as frontend history expects: { date: "May 3, 2026", symptoms: [...] }
    const formatted = logs.map(log => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric"
      }),
      symptoms: log.symptoms  // already { name, severity } — matches frontend
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};