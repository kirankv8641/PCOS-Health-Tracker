 const mongoose = require("mongoose");

const cycleLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Period Dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },

  // Flow
  flow: {
    type: String,
    enum: ["light", "medium", "heavy"],
    default: "medium"
  },

  // Cycle Info
  cycleLength: {
    type: Number  
  },
  periodDuration: {
    type: Number  
  },

  // Next Period Prediction
  nextPeriodDate: {
    type: Date
  },

  // Notes
  notes: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("CycleLog", cycleLogSchema);