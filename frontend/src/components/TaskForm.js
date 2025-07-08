import React, { useState, useEffect } from 'react';

export default function TaskForm({ initial, onSubmit, submitLabel = 'Add Task' }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    // format initial.dueDate as YYYY-MM-DD or empty
    dueDate: initial?.dueDate?.slice(0,10) || '',
    recurrence: initial?.recurrence || 'none'
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title:       initial.title,
        description: initial.description,
        dueDate:     initial.dueDate.slice(0,10),
        recurrence:  initial.recurrence
      });
    }
  }, [initial]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      dueDate: new Date(form.dueDate).toISOString()
    });
    if (!initial) {
      setForm({ title:'', description:'', dueDate:'', recurrence:'none' });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        required
        style={{ marginRight: '.5rem' }}
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      />
      <input
        name="dueDate"
        type="date"
        placeholder="Due date"
        value={form.dueDate}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      />
      <select
        name="recurrence"
        value={form.recurrence}
        onChange={handleChange}
        style={{ marginRight: '.5rem' }}
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
