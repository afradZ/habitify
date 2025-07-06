import React, { useContext, useEffect, useState } from 'react';
import { AuthContext }      from '../context/AuthContext';
import { fetchSettings, updateSettings } from '../api/settings';

export default function Settings() {
  const { auth } = useContext(AuthContext);
  const token    = auth.token;

  // initial form state, must match your schema defaults
  const [form, setForm] = useState({
    taskReminderTime:  '08:00',
    habitReminderTime: '08:00',
    monthlyTaskGoal:   20,
    monthlyHabitGoal:  30
  });

  // load existing settings on mount
  useEffect(() => {
    fetchSettings(token).then(res => {
      setForm({
        taskReminderTime:  res.data.taskReminderTime,
        habitReminderTime: res.data.habitReminderTime,
        monthlyTaskGoal:   res.data.monthlyTaskGoal,
        monthlyHabitGoal:  res.data.monthlyHabitGoal
      });
    });
  }, [token]);

  // handle any change in the form inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  // submit updated settings
  function handleSubmit(e) {
    e.preventDefault();
    updateSettings(token, form)
      .then(() => alert('Settings saved'))
      .catch(() => alert('Failed to save settings'));
  }

  return (
    <div className="page">
      <h1>Reminder & Goal Settings</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Task reminder time:
          <input
            type="time"
            name="taskReminderTime"
            value={form.taskReminderTime}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Habit reminder time:
          <input
            type="time"
            name="habitReminderTime"
            value={form.habitReminderTime}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Monthly task goal:
          <input
            type="number"
            name="monthlyTaskGoal"
            min="0"
            value={form.monthlyTaskGoal}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Monthly habit goal:
          <input
            type="number"
            name="monthlyHabitGoal"
            min="0"
            value={form.monthlyHabitGoal}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}


