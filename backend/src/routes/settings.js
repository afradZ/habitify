const express = require('express');
const auth    = require('../middleware/auth');
const User    = require('../models/User');

const router = express.Router();

// GET /api/settings
// Returns the current user’s settings
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user).select('settings');
  res.json(user.settings);
});

// PUT /api/settings
// Update reminder hours and monthly goals
router.put('/', auth, async (req, res) => {
  const {
    taskReminderTime,
    habitReminderTime,
    monthlyTaskGoal,
    monthlyHabitGoal
  } = req.body;

  const user = await User.findById(req.user);
  user.settings.taskReminderTime   = taskReminderTime;
  user.settings.habitReminderTime  = habitReminderTime;
  user.settings.monthlyTaskGoal    = monthlyTaskGoal;
  user.settings.monthlyHabitGoal   = monthlyHabitGoal;
  await user.save();

  res.json(user.settings);
});

module.exports = router;
