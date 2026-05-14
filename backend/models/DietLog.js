const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cal:  { type: Number, required: true, min: 0 },
    time: { type: String, default: "" },
  },
  { _id: true }
);

const waterLogSchema = new mongoose.Schema(
  {
    amount:  { type: String, default: "" },
    glasses: { type: Number, default: 1, min: 0 },
    time:    { type: String, default: "" },
  },
  { _id: true }
);

const seedLogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dose: { type: String, default: "" },
    time: { type: String, default: "" },
  },
  { _id: true }
);

const teaLogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cups: { type: String, default: "" },
    time: { type: String, default: "" },
  },
  { _id: true }
);

const dietLogSchema = new mongoose.Schema(
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

    // Computed total — updated whenever meals change
    calories:     { type: Number, default: 0, min: 0 },
    waterGlasses: { type: Number, default: 0, min: 0 },

    meals:     { type: [mealSchema],     default: [] },
    waterLogs: { type: [waterLogSchema], default: [] },
    seedLogs:  { type: [seedLogSchema],  default: [] },
    teaLogs:   { type: [teaLogSchema],   default: [] },
  },
  { timestamps: true }
);

// One log per user per day
dietLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DietLog", dietLogSchema);