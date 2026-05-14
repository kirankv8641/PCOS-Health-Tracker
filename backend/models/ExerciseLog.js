const mongoose = require("mongoose");

const exerciseLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    activity: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    intensity: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate",
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    calories: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index for fast per-user, per-date queries
exerciseLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("ExerciseLog", exerciseLogSchema);