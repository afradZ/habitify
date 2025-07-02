// backend/src/routes/analytics.js

const express  = require('express');
const Task     = require('../models/Task');
const Habit    = require('../models/Habit');
const auth     = require('../middleware/auth');

const router = express.Router();

// helper: compare dates ignoring time
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

/**
 * Compute consecutive daily streak from an array of Date objects.
 */
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

/**
 * GET /api/analytics/tasks
 * Returns counts of tasks completed per day over the last 7 days.
 */
router.get('/tasks', auth, async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);

    const data = await Task.aggregate([
      { $match: {
          owner: req.user,            // use string ID, let Mongoose cast
          completed: true,
          updatedAt: { $gte: since }
        }
      },
      { $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }
        }
      },
      { $group: {
          _id: "$day",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error('Analytics /tasks error:', err);
    res.status(500).send('Server error');
  }
});

/**
 * GET /api/analytics/habits
 * Returns counts of habit check-ins per day over the last 7 days.
 */
router.get('/habits', auth, async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 6);

    const data = await Habit.aggregate([
      { $match: { owner: req.user } },      // string ID again
      { $unwind: "$checkIns" },
      { $match: { checkIns: { $gte: since } } },
      { $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$checkIns" } }
        }
      },
      { $group: {
          _id: "$day",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error('Analytics /habits error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
