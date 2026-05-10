const User = require("../models/user");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      weight,
      height,
      lastPeriodDate,
      cycleLength,
      periodDuration,
      commonSymptoms,
      medicalConditions,
      diagnosedWithPCOS,
      affirmationsEnabled
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        age,
        gender,
        weight,
        height,
        lastPeriodDate,
        cycleLength,
        periodDuration,
        commonSymptoms,
        medicalConditions,
        diagnosedWithPCOS,
        affirmationsEnabled
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};