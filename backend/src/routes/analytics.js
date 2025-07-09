const express   = require('express');
const mongoose  = require('mongoose');
const User      = require('../models/User');
const Task      = require('../models/Task');
const Habit     = require('../models/Habit');
const auth      = require('../middleware/auth');

const router    = express.Router();
const ObjectId  = mongoose.Types.ObjectId;

const DEFAULT_RANGE = 7;
const DEFAULT_YEAR  = new Date().getFullYear();

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

// computeStreak unchanged…

/**
 * GET /api/analytics/tasks
 * Counts of completed tasks per day over the last `range` days
 */
router.get('/tasks', auth, async (req, res) => {
  console.log('📊 Analytics /tasks for user', req.user);
  try {
    const range = parseInt(req.query.range, 10) || DEFAULT_RANGE;
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
          day: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
        }
      },
      { $group: {
          _id:   '$day',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json(data);
  } catch (err) {
    console.error('Analytics /tasks error:', err);
    return res.status(500).send('Server error');
  }
});

/**
 * GET /api/analytics/habits
 * Counts of habit check-ins per day over the last `range` days
 */
router.get('/habits', auth, async (req, res) => {
  console.log('📊 Analytics /habits for user', req.user);
  try {
    const range = parseInt(req.query.range, 10) || DEFAULT_RANGE;
    const since = new Date();
    since.setDate(since.getDate() - (range - 1));

    const data = await Habit.aggregate([
      { $match: { owner: new ObjectId(req.user) } },
      { $unwind: '$checkIns' },
      { $match: { checkIns: { $gte: since } } },
      { $project: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$checkIns' } }
        }
      },
      { $group: {
          _id:   '$day',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json(data);
  } catch (err) {
    console.error('Analytics /habits error:', err);
    return res.status(500).send('Server error');
  }
});

/**
 * GET /api/analytics/tasks/monthly
 * Counts of completed tasks per month for a given year
 */
router.get('/tasks/monthly', auth, async (req, res) => {
  console.log('📊 Analytics /tasks/monthly for user', req.user);
  try {
    const year  = parseInt(req.query.year, 10) || DEFAULT_YEAR;
    const start = new Date(`${year}-01-01`);
    const end   = new Date(start);
    end.setFullYear(end.getFullYear() + 1);

    const data = await Task.aggregate([
      { $match: {
          owner:      new ObjectId(req.user),
          completed:  true,
          updatedAt: { $gte: start, $lt: end }
        }
      },
      { $project: {
          month: { $dateToString: { format: '%Y-%m', date: '$updatedAt' } }
        }
      },
      { $group: {
          _id:   '$month',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json(data);
  } catch (err) {
    console.error('Analytics /tasks/monthly error:', err);
    return res.status(500).send('Server error');
  }
});

/**
 * GET /api/analytics/habits/monthly
 * Counts of habit check-ins per month for a given year
 */
router.get('/habits/monthly', auth, async (req, res) => {
  console.log('📊 Analytics /habits/monthly for user', req.user);
  try {
    const year  = parseInt(req.query.year, 10) || DEFAULT_YEAR;
    const start = new Date(`${year}-01-01`);
    const end   = new Date(start);
    end.setFullYear(end.getFullYear() + 1);

    const data = await Habit.aggregate([
      { $match: { owner: new ObjectId(req.user) } },
      { $unwind: '$checkIns' },
      { $match: { checkIns: { $gte: start, $lt: end } } },
      { $project: {
          month: { $dateToString: { format: '%Y-%m', date: '$checkIns' } }
        }
      },
      { $group: {
          _id:   '$month',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json(data);
  } catch (err) {
    console.error('Analytics /habits/monthly error:', err);
    return res.status(500).send('Server error');
  }
});

/**
 * GET /api/analytics/goals
 * This month’s completed counts vs user’s monthly goals
 */
router.get('/goals', auth, async (req, res) => {
  console.log('📊 Analytics /goals for user', req.user);
  try {
    const user  = await User.findById(req.user);
    const now   = new Date();
    const year  = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // task goals
    const start = new Date(`${year}-${month}-01`);
    const end   = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const tasksCompleted = await Task.countDocuments({
      owner:     user._id,
      completed: true,
      updatedAt: { $gte: start, $lt: end }
    });

    // habit goals
    const habitAgg = await Habit.aggregate([
      { $match: { owner: user._id } },
      { $unwind: '$checkIns' },
      { $match: { checkIns: { $gte: start, $lt: end } } },
      { $count: 'count' }
    ]);
    const habitsCheckedIn = habitAgg[0]?.count || 0;

    return res.json({
      tasksCompleted,
      taskGoal:    user.settings.monthlyTaskGoal,
      habitsCheckedIn,
      habitGoal:   user.settings.monthlyHabitGoal
    });
  } catch (err) {
    console.error('Analytics /goals error:', err);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
