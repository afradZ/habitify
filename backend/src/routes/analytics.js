const express  = require('express');
const mongoose = require('mongoose');
const Task     = require('../models/Task');
const Habit    = require('../models/Habit');
const auth     = require('../middleware/auth');

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

const DEFAULT_RANGE = 7;

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

// computeStreak unchanged…

router.get('/tasks', auth, async (req, res) => {
  try {
    // ← read & parse range from query
    const range = parseInt(req.query.range) || DEFAULT_RANGE;
    const since = new Date();
    since.setDate(since.getDate() - (range - 1));

    const data = await Task.aggregate([
      { $match: {
          owner:      new ObjectId(req.user),
          completed:  true,
          updatedAt: { $gte: since }
        }
      },
      { $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }
        }
      },
      { $group: {
          _id:   "$day",
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

router.get('/habits', auth, async (req, res) => {
  try {
    const range = parseInt(req.query.range) || DEFAULT_RANGE;
    const since = new Date();
    since.setDate(since.getDate() - (range - 1));

    const data = await Habit.aggregate([
      { $match: { owner: new ObjectId(req.user) } },
      { $unwind: "$checkIns" },
      { $match: { checkIns: { $gte: since } } },
      { $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$checkIns" } }
        }
      },
      { $group: {
          _id:   "$day",
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

