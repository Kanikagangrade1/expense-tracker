const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // or ../models/User if filename is User.js
const { jwtAuthMiddleware } = require("../jwt");

const router = express.Router();

// test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "User routes working ✅" });
});

// update name
router.put("/update-profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating profile",
    });
  }
});

// update password
router.put("/update-password", jwtAuthMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: "Password not found for this user",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating password",
    });
  }
});

module.exports = router;