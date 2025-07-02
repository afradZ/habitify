import { useState } from 'react';

export default function HabitForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', frequency: 'daily' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', frequency: 'daily' });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="name"
        placeholder="Habit name"
        value={form.name}
        onChange={handleChange}
        required
        style={{ marginRight: '.5rem' }}
      />
      <select
        name="frequency"
        value={form.frequency}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button type="submit">Add Habit</button>
    </form>
  );
}
