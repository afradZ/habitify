import React, { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../api/settings';

export default function Settings() {
  const token    = localStorage.getItem('token');

  // 1) State keys exactly match your backend API
  const [form, setForm] = useState({
    taskReminderTime:  '08:00',
    habitReminderTime: '08:00',
    monthlyTaskGoal:   '20', // keep as strings for controlled inputs
    monthlyHabitGoal:  '30'
  });

  // 2) Load existing settings once we have a token
  useEffect(() => {
    if (!token) return;
    getSettings(token).then(res => {
      setForm({
        taskReminderTime:  res.data.taskReminderTime  || '08:00',
        habitReminderTime: res.data.habitReminderTime || '08:00',
        monthlyTaskGoal:   String(res.data.monthlyTaskGoal  ?? '20'),
        monthlyHabitGoal:  String(res.data.monthlyHabitGoal ?? '30')
      });
    });
  }, [token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateSettings(token, {
      taskReminderTime:  form.taskReminderTime,
      habitReminderTime: form.habitReminderTime,
      monthlyTaskGoal:   parseInt(form.monthlyTaskGoal, 10),
      monthlyHabitGoal:  parseInt(form.monthlyHabitGoal,  10)
    })
      .then(() => alert('Settings saved'))
      .catch(() => alert('Failed to save settings'));
  }

  return (
    <div className="page form-page">
      <h1>Reminder &amp; Goal Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Task reminder time
          <input
            type="time"
            name="taskReminderTime"
            value={form.taskReminderTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Habit reminder time
          <input
            type="time"
            name="habitReminderTime"
            value={form.habitReminderTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Monthly task goal
          <input
            type="number"
            name="monthlyTaskGoal"
            min="0"
            value={form.monthlyTaskGoal}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Monthly habit goal
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



