const mongoose = require("mongoose");

const symptomLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  symptoms: [
    {
      name: String,
      severity: Number  // 0=none, 1=mild, 2=moderate, 3=severe
    }
  ],
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("SymptomLog", symptomLogSchema);