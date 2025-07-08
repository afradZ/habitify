/**
 * Stubbed mailer functions. 
 * In real life you’d wire these up to an SMTP service.
 */

async function sendTaskReminder() {
  // find overdue tasks, email their owners…
  // for tests we can leave this empty
}

async function sendHabitReminder() {
  // find un‐checked habits, email their owners…
  // for tests we can leave this empty
}

module.exports = {
  sendTaskReminder,
  sendHabitReminder
};