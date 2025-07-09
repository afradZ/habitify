const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  settings: {
    // hour of day for the daily task reminder (0–23)
    taskReminderTime: {
      type: String,
      match: /^[0-2]\d:[0-5]\d$/,
      default: '08:00'
    },
    // hour of day for the daily habit reminder
    habitReminderHour: {
      type: String,
      match: /^[0-2]\d:[0-5]\d$/,
      default: '08:00'
    },
    // user’s monthly target for completed tasks
    monthlyTaskGoal: {
      type: Number,
      default: 20
    },
    // user’s monthly target for habit check-ins
    monthlyHabitGoal: {
      type: Number,
      default: 30
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

