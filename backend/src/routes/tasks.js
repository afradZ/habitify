const express = require('express');
const Task    = require('../models/Task');
const auth    = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, recurrence } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });

    const task = new Task({
      title,
      description,
      dueDate,
      recurrence,
      owner: req.user
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks for this user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, dueDate, recurrence, completed } = req.body;

    // Find task
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.owner.toString() !== req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    task.title       = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate     = dueDate ?? task.dueDate;
    task.recurrence  = recurrence ?? task.recurrence;
    task.completed   = typeof completed === 'boolean' ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/tasks/:id
// Private – only deletes if owner matches
router.delete('/:id', auth, async (req, res) => {
  try {
    // Attempt to delete the task, but only if it belongs to this user
    const result = await Task.deleteOne({
      _id: req.params.id,
      owner: req.user
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: 'Task not found or not authorized' });
    }

    return res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error('   delete error:', err);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
