// backend/src/routes/habits.js
const express = require('express');
const mongoose = require('mongoose');
const Habit   = require('../models/Habit');
const auth    = require('../middleware/auth');

const router = express.Router();

// helper to strip time and compare dates
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

// compute current streak for daily habits
function computeStreak(habit) {
  const checkIns = habit.checkIns
    .map(d => new Date(d))
    .sort((a, b) => b - a);

  let streak = 0;
  let cursor = new Date();
  for (const d of checkIns) {
    if (isSameDay(d, cursor)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// POST /api/habits        Create a new habit
router.post('/', auth, async (req, res) => {
  try {
    const { name, frequency } = req.body;
    if (!name) return res.status(400).json({ msg: 'Name is required' });

    const habit = new Habit({
      name,
      frequency,
      owner: req.user
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/habits         List all habits with streak
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ owner: req.user }).lean();
    const withStreak = habits.map(h => ({
      ...h,
      streak: computeStreak(h)
    }));
    res.json(withStreak);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/habits/:id/checkin   Log today’s check-in
router.post('/:id/checkin', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid habit ID' });
    }

    const habit = await Habit.findOne({ _id: id, owner: req.user });
    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found or not authorized' });
    }

    const today = new Date();
    if (!habit.checkIns.some(d => isSameDay(d, today))) {
      habit.checkIns.push(today);
      await habit.save();
    }
    const streak = computeStreak(habit);
    res.json({ ...habit.toObject(), streak });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
