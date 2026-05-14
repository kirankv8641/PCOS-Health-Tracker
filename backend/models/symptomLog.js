const mongoose = require("mongoose");

const symptomEntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      // 0 = None, 1 = Mild, 2 = Moderate, 3 = Severe
    },
  },
  { _id: false }
);

const symptomLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    symptoms: {
      type: [symptomEntrySchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// One log per user per day
symptomLogSchema.index({ userId: 1, date: -1 });
symptomLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("SymptomLog", symptomLogSchema);