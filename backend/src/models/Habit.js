const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // store each time the user “checks in”
  checkIns: {
    type: [Date],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);
