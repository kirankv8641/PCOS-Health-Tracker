 const CycleLog = require("../models/cycleLog");

// Log Period
exports.logCycle = async (req, res) => {
  try {
    const { startDate, endDate, flow, notes } = req.body;

    // calculate period duration
    const periodDuration = endDate
      ? Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : null;

    // get last cycle to calculate cycle length
    const lastCycle = await CycleLog.findOne({ user: req.user.id }).sort({ startDate: -1 });

    const cycleLength = lastCycle
      ? Math.round((new Date(startDate) - new Date(lastCycle.startDate)) / (1000 * 60 * 60 * 24))
      : 28;

    // predict next period
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

    const cycle = await CycleLog.create({
      user: req.user.id,
      startDate,
      endDate,
      flow,
      periodDuration,
      cycleLength,
      nextPeriodDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Cycle logged successfully",
      data: cycle
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Cycle History
exports.getCycleHistory = async (req, res) => {
  try {
    const cycles = await CycleLog.find({ user: req.user.id }).sort({ startDate: -1 });
    res.status(200).json({ success: true, data: cycles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Predict Next Period
exports.predictNextPeriod = async (req, res) => {
  try {
    const lastCycle = await CycleLog.findOne({ user: req.user.id }).sort({ startDate: -1 });

    if (!lastCycle) {
      return res.status(404).json({ success: false, message: "No cycle data found" });
    }

    res.status(200).json({
      success: true,
      data: {
        lastPeriodDate: lastCycle.startDate,
        nextPeriodDate: lastCycle.nextPeriodDate,
        cycleLength: lastCycle.cycleLength
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Cycle Log
exports.deleteCycle = async (req, res) => {
  try {
    await CycleLog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Cycle log deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};