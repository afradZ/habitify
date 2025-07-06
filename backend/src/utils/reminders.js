const cron  = require('node-cron');
const User  = require('../models/User');
const Task  = require('../models/Task');
const Habit = require('../models/Habit');

function sendEmail(to, subject, body) {
  console.log(`\n📧 To: ${to} — ${subject}\n${body}\n`);
}

module.exports = function scheduleReminders() {
  // runs every minute for testing; change back to '0 * * * *' later
  cron.schedule('* * * * *', async () => {
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, '0');
    const mm   = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;

    // TASK reminders
    const tUsers = await User.find({ 'settings.taskReminderTime': currentTime });
    for (let u of tUsers) {
      const today    = new Date(); today.setHours(0,0,0,0);
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);

      const due = await Task.find({
        owner:     u._id,
        dueDate:   { $gte: today, $lt: tomorrow },
        completed: false
      });

      if (due.length) {
        sendEmail(
          u.email,
          'Tasks due today',
          `You have ${due.length} tasks due today:\n` +
            due.map(t => `• ${t.title}`).join('\n')
        );
      }
    }

    // HABIT reminders
    const hUsers = await User.find({ 'settings.habitReminderTime': currentTime });
    for (let u of hUsers) {
      const allHabits = await Habit.find({ owner: u._id });
      const missed    = allHabits.filter(h => {
        return !h.checkIns.some(d =>
          new Date(d).toDateString() === now.toDateString()
        );
      });

      if (missed.length) {
        sendEmail(
          u.email,
          'Habit check-ins pending',
          `You have ${missed.length} habits not checked in today:\n` +
            missed.map(h => `• ${h.name}`).join('\n')
        );
      }
    }
  });

  console.log('🔔 Reminders scheduler started');
};
