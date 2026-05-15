const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  key:     { type: String, required: true },
  label:   { type: String, required: true },
  sub:     { type: String, default: "" },
  icon:    { type: String, default: "" },
  time:    { type: String, default: "08:00" }, // "HH:MM"
  enabled: { type: Boolean, default: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Account info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Personal Info
  age:    { type: Number },
  gender: { type: String, default: "Female" },
  weight: { type: Number },  // in kg
  height: { type: Number },  // in cm

  // Cycle Info
  lastPeriodDate: { type: Date },
  cycleLength:    { type: Number, default: 28 },
  periodDuration: { type: Number, default: 5 },

  // Health Info
  commonSymptoms: [{
    type: String,
    enum: [
      "cramps", "bloating", "mood swings", "headache", "fatigue",
      "back pain", "acne", "hair loss", "irregular periods", "weight gain",
      "weight loss", "insulin resistance", "excess hair growth",
      "sleep problems", "anxiety", "depression", "low libido", "pelvic pain"
    ]
  }],
  medicalConditions: { type: String, default: "" },

  // PCOS specific
  diagnosedWithPCOS: { type: Boolean, default: false },

  // Affirmations
  affirmationsEnabled: { type: Boolean, default: false },

  // Reminder Timings
  reminders: { type: [reminderSchema], default: [] }

}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);